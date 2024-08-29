import { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/SimulationsPage.css'; // Certifique-se de que o caminho esteja correto
import { createSimulation, getSavedSimulations, deleteSimulation, updateSimulationProgress } from '../services/simulationService'; // Ajuste o caminho do serviço conforme necessário

const SimulationPage = () => {
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsToSave, setMonthsToSave] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    // Carrega simulações salvas ao carregar a página
    const fetchSimulations = async () => {
      const simulations = await getSavedSimulations();
      setSavedSimulations(simulations);
    };
    fetchSimulations();
  }, []);

  const handleStartSimulation = () => {
    const total = parseFloat(totalValue);
    const monthly = parseFloat(monthlySavings);
    if (total > 0 && monthly > 0) {
      const months = Math.ceil(total / monthly);
      setMonthsToSave(months);
    } else {
      alert('Por favor, insira valores válidos para o valor total e a economia mensal.');
    }
  };

  const handleSaveSimulation = async () => {
    const simulation = {
      name,
      totalValue: parseFloat(totalValue),
      monthlySavings: parseFloat(monthlySavings),
      monthsToSave
    };
    await createSimulation(simulation);
    const simulations = await getSavedSimulations();
    setSavedSimulations(simulations);
    resetForm();
  };

  const handleRestartSimulation = () => {
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTotalValue('');
    setMonthlySavings('');
    setMonthsToSave(null);
  };

  const handleDeleteSimulation = async (id) => {
    await deleteSimulation(id);
    const simulations = await getSavedSimulations();
    setSavedSimulations(simulations);
  };

  const toggleDetails = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const handleMonthValueChange = async (simulationId, month) => {
    // Atualiza o progresso da simulação
    await updateSimulationProgress(simulationId, month);
    const simulations = await getSavedSimulations();
    setSavedSimulations(simulations);
  };

  const calculateMonths = (createdAt, monthsToSave) => {
    const months = [];
    for (let i = 1; i <= monthsToSave; i++) {
      months.push({
        month: i,
        label: `${i}° mês`
      });
    }
    return months;
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
          savedSimulations.map((simulation) => (
            <div key={simulation.id} className="simulation-item">
              <div className="simulation-header">
                <div className="circle-checkbox">
                  {simulation.remainingValue === 0 ? (
                    <div className="circle-checked">
                      <FaCheck />
                    </div>
                  ) : (
                    <div className="circle-unchecked" />
                  )}
                </div>
                <div className="simulation-content">
                  <div className="simulation-name">
                    <span>{simulation.name}</span>
                  </div>
                  <div className="simulation-actions">
                    <button className="toggle-button" onClick={() => toggleDetails(simulation.id)}>
                      {activeItem === simulation.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteSimulation(simulation.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              {activeItem === simulation.id && (
                <div className="simulation-details">
                  <div className="simulation-progress">
                    {calculateMonths(simulation.createdAt, simulation.monthsToSave).map(({ month, label }) => (
                      <div key={month} className="month-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={simulation.monthValues[month] || false}
                            onChange={() => handleMonthValueChange(simulation.id, month)}
                          />
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="simulation-footer">
                    Total restante: R${simulation.remainingValue.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimulationPage;