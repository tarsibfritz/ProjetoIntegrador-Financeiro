import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addSimulation, getSimulations } from '../services/simulationService';
import '../styles/SimulationsPage.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SimulationPage = () => {
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsToSave, setMonthsToSave] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [monthValues, setMonthValues] = useState({});

  useEffect(() => {
    const loadSimulations = async () => {
      try {
        const simulations = await getSimulations();
        setSavedSimulations(simulations.map(sim => ({
          ...sim,
          monthValues: {}, // Inicializa monthValues para simulações salvas
          goalAchieved: calculateRemainingValue(sim, {}) <= 0
        })));
      } catch (error) {
        console.error('Erro ao carregar simulações:', error);
        toast.error('Erro ao carregar simulações salvas.');
      }
    };

    loadSimulations();
  }, []);

  const handleStartSimulation = () => {
    try {
      const total = parseFloat(totalValue);
      const savings = parseFloat(monthlySavings);

      if (isNaN(total) || isNaN(savings) || savings <= 0) {
        throw new Error('Valor total e valor mensal devem ser números válidos e o valor mensal deve ser maior que zero.');
      }

      const calculatedMonths = total <= 0 ? 0 : Math.ceil(total / savings);
      setMonthsToSave(calculatedMonths);
    } catch (error) {
      toast.error(error.message || 'Erro ao calcular a simulação.');
    }
  };

  const handleSaveSimulation = async () => {
    if (!window.confirm('Deseja converter essa simulação em um plano real?')) return;
    try {
      const newSimulation = await addSimulation({
        name,
        totalValue,
        monthlySavings,
        monthsToSave,
        createdAt: new Date()
      });
      const updatedSimulation = {
        ...newSimulation,
        monthValues: {}, // Inicializa monthValues para a nova simulação
        goalAchieved: calculateRemainingValue(newSimulation, {}) <= 0
      };
      toast.success('Simulação salva com sucesso!');
      setSavedSimulations([...savedSimulations, updatedSimulation]);
      handleRestartSimulation();
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      toast.error(error.message || 'Erro ao salvar a simulação.');
    }
  };

  const handleRestartSimulation = () => {
    setName('');
    setTotalValue('');
    setMonthlySavings('');
    setMonthsToSave(null);
    setMonthValues({});
  };

  const toggleDetails = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const calculateMonths = (createdAt, totalMonths) => {
    const creationDate = new Date(createdAt);
    const monthsArray = [];

    for (let i = 0; i < totalMonths; i++) {
      const monthDate = new Date(creationDate);
      monthDate.setMonth(monthDate.getMonth() + i);
      monthsArray.push({
        month: i + 1,
        label: monthDate.toLocaleString('default', { month: 'short', year: 'numeric' })
      });
    }

    return monthsArray;
  };

  const handleMonthValueChange = (simulationId, month) => {
    setSavedSimulations(prevSimulations => prevSimulations.map(simulation => {
      if (simulation.id === simulationId) {
        const updatedMonthValues = {
          ...simulation.monthValues,
          [month]: !simulation.monthValues[month]
        };

        const goalAchieved = calculateRemainingValue({
          ...simulation,
          monthValues: updatedMonthValues
        }, updatedMonthValues) <= 0;

        return {
          ...simulation,
          monthValues: updatedMonthValues,
          goalAchieved
        };
      }
      return simulation;
    }));
  };

  const calculateRemainingValue = (simulation, monthValues) => {
    const totalValue = parseFloat(simulation.totalValue);
    const monthlySavings = parseFloat(simulation.monthlySavings);
    const checkedMonths = Object.keys(monthValues).filter(month => monthValues[month]).length;
    const totalSavings = checkedMonths * monthlySavings;
    const remainingValue = totalValue - totalSavings;
    return Math.max(0, remainingValue); // Retorna 0 se o valor restante for menor que 0
  };

  return (
    <div className="simulation-container">
      <div className="simulation-form">
        <h2>Criar Simulação</h2>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor total do item/meta"
          value={totalValue}
          onChange={(e) => setTotalValue(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor mensal que você pode economizar"
          value={monthlySavings}
          onChange={(e) => setMonthlySavings(e.target.value)}
        />
        <button onClick={handleStartSimulation}>Iniciar Simulação</button>
        {monthsToSave !== null && (
          <div>
            <p>Tempo estimado para alcançar a meta: {monthsToSave} meses</p>
            <button onClick={handleSaveSimulation}>Salvar Simulação</button>
            <button onClick={handleRestartSimulation}>Reiniciar Simulação</button>
          </div>
        )}
      </div>
      <div className="saved-simulations">
        <h2>Simulações Salvas</h2>
        {savedSimulations.length === 0 ? (
          <p className="no-items">Nenhuma simulação salva.</p>
        ) : (
          <ul>
            {savedSimulations.map((simulation) => {
              const monthsArray = calculateMonths(simulation.createdAt, simulation.monthsToSave);
              return (
                <li
                  key={simulation.id}
                  className={`simulation-item ${activeItem === simulation.id ? 'active' : ''}`}
                >
                  <div className={`circle ${simulation.goalAchieved ? 'checked' : ''}`}></div>
                  <div className="item-details">
                    <h3>{simulation.name}</h3>
                    <p className="monthly-savings">Valor Mensal: {simulation.monthlySavings}</p>
                    <span
                      className="toggle-button"
                      onClick={() => toggleDetails(simulation.id)}
                    >
                      {activeItem === simulation.id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                    {activeItem === simulation.id && (
                      <div className="toggle-content">
                        <p><strong>Valor Total:</strong> {simulation.totalValue}</p>
                        <div className="months-checklist">
                          {monthsArray.map(({ month, label }) => (
                            <div key={month} className="month-checkbox">
                              <input
                                type="checkbox"
                                id={`month-${month}`}
                                checked={!!(simulation.monthValues[month] || false)}
                                onChange={() => handleMonthValueChange(simulation.id, month)}
                              />
                              <label htmlFor={`month-${month}`}>
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <p className="remaining-value"><strong>Total:</strong> {calculateRemainingValue(simulation, simulation.monthValues).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;