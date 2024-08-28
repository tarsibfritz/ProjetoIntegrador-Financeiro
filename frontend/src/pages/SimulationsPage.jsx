import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addSimulation, getSimulations } from '../services/simulationService';
import '../styles/SimulationsPage.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Para o toggle

const SimulationPage = () => {
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsToSave, setMonthsToSave] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    // Carregar simulações salvas ao montar o componente
    const loadSimulations = async () => {
      try {
        const simulations = await getSimulations();
        setSavedSimulations(simulations);
      } catch (error) {
        toast.error('Erro ao carregar simulações salvas.');
      }
    };

    loadSimulations();
  }, []);

  const handleStartSimulation = async () => {
    try {
      const total = parseFloat(totalValue);
      const savings = parseFloat(monthlySavings);

      if (isNaN(total) || isNaN(savings) || savings <= 0) {
        throw new Error('Valor total e valor mensal devem ser números válidos e o valor mensal deve ser maior que zero.');
      }

      // Calcular os meses para alcançar a meta
      const calculatedMonths = total <= 0 ? 0 : Math.ceil(total / savings);
      setMonthsToSave(calculatedMonths);
    } catch (error) {
      toast.error(error.message || 'Erro ao calcular a simulação.');
    }
  };

  const handleSaveSimulation = async () => {
    if (!window.confirm('Deseja converter essa simulação em um plano real?')) return;
    try {
      const newSimulation = await addSimulation({ name, totalValue, monthlySavings, monthsToSave });
      toast.success('Simulação salva com sucesso!');
      setSavedSimulations([...savedSimulations, newSimulation]); // Atualizar lista de simulações salvas
      handleRestartSimulation(); // Zerar o formulário após salvar a simulação
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar a simulação.');
    }
  };

  const handleRestartSimulation = () => {
    setName('');
    setTotalValue('');
    setMonthlySavings('');
    setMonthsToSave(null);
  };

  const toggleDetails = (id) => {
    setActiveItem(activeItem === id ? null : id);
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
            {savedSimulations.map((simulation) => (
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
                      <p><strong>Meses Necessários:</strong> {simulation.monthsToSave}</p>
                      <p><strong>Valor Economizado:</strong> {simulation.savedAmount}</p>
                      <p><strong>Meta Alcançada:</strong> {simulation.goalAchieved ? 'Sim' : 'Não'}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;