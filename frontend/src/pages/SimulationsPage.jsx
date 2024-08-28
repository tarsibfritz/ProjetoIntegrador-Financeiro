import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addSimulation, getSimulations, updateProgress, getProgressBySimulationId } from '../services/simulationService';
import '../styles/SimulationsPage.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SimulationPage = () => {
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsToSave, setMonthsToSave] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const loadSimulations = async () => {
      try {
        const simulations = await getSimulations();
        const simulationsWithProgress = await Promise.all(
          simulations.map(async (simulation) => {
            try {
              const progress = await getProgressBySimulationId(simulation.id);
              const monthsCount = simulation.monthsToSave || 0;
              const updatedProgress = Array.from({ length: monthsCount }, (_, index) => progress[index]?.isChecked || false);
              return { ...simulation, progress: updatedProgress };
            } catch (error) {
              console.error(`Erro ao obter progresso para a simulação ${simulation.id}:`, error);
              return { ...simulation, progress: Array.from({ length: simulation.monthsToSave || 0 }, () => false) };
            }
          })
        );
        setSavedSimulations(simulationsWithProgress);
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

      const initializeMonths = () => {
        const monthsArray = [];
        for (let i = 1; i <= calculatedMonths; i++) {
          monthsArray.push({ month: i, checked: false });
        }
        setMonths(monthsArray);
      };

      initializeMonths();
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
        createdAt: new Date(),
        progress: Array.from({ length: monthsToSave }, () => false) // Inicializa o progresso como um array de falsos
      });
      toast.success('Simulação salva com sucesso!');
      setSavedSimulations([...savedSimulations, newSimulation]);
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
    setMonths([]);
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

  const handleMonthCheck = async (simulationId, month) => {
    const updatedSimulations = savedSimulations.map((simulation) => {
      if (simulation.id === simulationId) {
        const updatedProgress = simulation.progress.map((p, index) =>
          index === month - 1 ? !p : p
        );
        return { ...simulation, progress: updatedProgress };
      }
      return simulation;
    });

    setSavedSimulations(updatedSimulations);

    try {
      const updatedSimulation = updatedSimulations.find((sim) => sim.id === simulationId);
      await updateProgress(simulationId, updatedSimulation.progress);
      toast.success('Progresso atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      toast.error('Erro ao atualizar o progresso.');
    }
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
                    <span
                      className="toggle-button"
                      onClick={() => toggleDetails(simulation.id)}
                    >
                      {activeItem === simulation.id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                    {activeItem === simulation.id && (
                      <div className="toggle-content">
                        <p><strong>Valor Total:</strong> {simulation.totalValue}</p>
                        <p><strong>Valor Mensal:</strong> {simulation.monthlySavings}</p>
                        <div className="months-checklist">
                          {monthsArray.map((m) => (
                            <div key={m.month}>
                              <input
                                type="checkbox"
                                id={`month-${m.month}-${simulation.id}`}
                                checked={simulation.progress[m.month - 1] || false}
                                onChange={() => handleMonthCheck(simulation.id, m.month)}
                              />
                              <label htmlFor={`month-${m.month}-${simulation.id}`}>Mês {m.month} ({m.label})</label>
                            </div>
                          ))}
                        </div>
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