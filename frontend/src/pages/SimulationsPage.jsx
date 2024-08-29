import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { addSimulation, getSimulations, deleteSimulation } from '../services/simulationService';
import { getProgressBySimulationId, updateProgress, createProgress } from '../services/progressService';
import '../styles/SimulationsPage.css';
import { FaChevronDown, FaChevronUp, FaTrash, FaCheck } from 'react-icons/fa';

const SimulationPage = () => {
  // Estado para armazenar informações da simulação e simulações salvas
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsToSave, setMonthsToSave] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // Efeito para carregar simulações salvas e seus progressos
  useEffect(() => {
    const loadSimulations = async () => {
      try {
        const simulations = await getSimulations();
        const simulationsWithProgress = await Promise.all(simulations.map(async (sim) => {
          const progress = await getProgressBySimulationId(sim.id);
          const progressMap = progress.reduce((acc, curr) => {
            acc[curr.month] = curr.isChecked;
            return acc;
          }, {});

          return {
            ...sim,
            monthValues: progressMap,
            remainingValue: calculateRemainingValue(sim, progressMap)
          };
        }));
        setSavedSimulations(simulationsWithProgress);
      } catch (error) {
        console.error('Erro ao carregar simulações:', error);
        toast.error('Erro ao carregar simulações salvas.');
      }
    };

    loadSimulations();
  }, []);

  // Validação para permitir apenas números e pontos em campos numéricos
  const validateNumberInput = (e) => {
    const key = e.key;
    const isNumber = /^[0-9.]$/.test(key) || e.key === 'Backspace' || e.key === 'Tab';
    if (!isNumber) {
      e.preventDefault();
      toast.warning('Somente números maiores que zero e pontos são permitidos.');
    }
  };

  // Validação para garantir que o valor é positivo
  const validatePositiveNumber = (value) => {
    if (parseFloat(value) < 0) {
      toast.warning('O valor não pode ser negativo.');
      return false;
    }
    return true;
  };

  // Validação para garantir que todos os campos foram preenchidos antes de iniciar uma simulação
  const handleStartSimulation = () => {
    if (!name.trim() || !totalValue.trim() || !monthlySavings.trim()) {
      toast.warning('Todos os campos são obrigatórios para iniciar uma simulação.');
      return;
    }

    if (totalValue.trim() === '.' || monthlySavings.trim() === '.') {
      toast.warning('O valor não pode ser apenas um ponto.');
      return;
    }

    try {
      const total = parseFloat(totalValue);
      const savings = parseFloat(monthlySavings);

      if (!validatePositiveNumber(total) || !validatePositiveNumber(savings)) {
        return;
      }

      if (total === 0 || savings === 0) {
        toast.warning('Os valores não podem ser iguais zero.');
        return;
      }

      if (savings > total) {
        toast.warning('O valor mensal não pode ser maior que o valor total do item/meta.');
        return;
      }

      const calculatedMonths = total <= 0 ? 0 : Math.ceil(total / savings);
      setMonthsToSave(calculatedMonths);
    } catch (error) {
      toast.error(error.message || 'Erro ao calcular a simulação.');
    }
  };

  // Sistema para salvar a simulação e o progresso no banco de dados
  const handleSaveSimulation = async () => {
    const result = await Swal.fire({
      title: 'Deseja salvar essa simulação?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, salvar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const newSimulation = await addSimulation({
          name,
          totalValue,
          monthlySavings,
          monthsToSave,
          createdAt: new Date()
        });

        const initialProgress = Array.from({ length: monthsToSave }, (_, i) => ({
          simulationId: newSimulation.id,
          month: i + 1,
          amountSaved: 0,
          isChecked: false
        }));

        await Promise.all(initialProgress.map(progressItem =>
          createProgress(progressItem)
        ));

        const updatedSimulation = {
          ...newSimulation,
          monthValues: {},
          remainingValue: calculateRemainingValue(newSimulation, {})
        };

        toast.success('Simulação salva com sucesso!');
        setSavedSimulations([...savedSimulations, updatedSimulation]);
        handleRestartSimulation();
      } catch (error) {
        console.error('Erro ao salvar simulação:', error);
        toast.error(error.message || 'Erro ao salvar a simulação.');
      }
    }
  };

  // Sistema para reiniciar/limpar os campos do formulário
  const handleRestartSimulation = () => {
    setName('');
    setTotalValue('');
    setMonthlySavings('');
    setMonthsToSave(null);
  };

  const toggleDetails = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };

  // Cálculo dos meses a partir da data de criação da simulação
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

  // Atualiza o progresso da simulação ao alterar o estado das checkboxes
  const handleMonthValueChange = async (simulationId, month) => {
    try {
      const updatedSimulations = await Promise.all(savedSimulations.map(async (simulation) => {
        if (simulation.id === simulationId) {
          const updatedMonthValues = {
            ...simulation.monthValues,
            [month]: !simulation.monthValues[month]
          };

          const progress = await getProgressBySimulationId(simulationId);
          const progressItem = progress.find(p => p.month === month);

          if (progressItem) {
            await updateProgress(progressItem.id, { ...progressItem, isChecked: updatedMonthValues[month] });
          } else {
            await createProgress({
              simulationId,
              month,
              amountSaved: simulation.monthlySavings,
              isChecked: updatedMonthValues[month]
            });
          }

          const remainingValue = calculateRemainingValue({
            ...simulation,
            monthValues: updatedMonthValues
          }, updatedMonthValues);

          return {
            ...simulation,
            monthValues: updatedMonthValues,
            remainingValue
          };
        }
        return simulation;
      }));

      setSavedSimulations(updatedSimulations);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      toast.error('Erro ao atualizar progresso.');
    }
  };

  // Sistema para excluir uma simulação do banco de dados
  const handleDeleteSimulation = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza que deseja excluir esta simulação?',
      text: "Essa ação não pode ser desfeita.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteSimulation(id);
        setSavedSimulations(savedSimulations.filter(sim => sim.id !== id));
        toast.success('Simulação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir simulação:', error);
        toast.error('Erro ao excluir a simulação.');
      }
    }
  };

  // Cálculo do valor restante da meta com base no progresso
  const calculateRemainingValue = (simulation, monthValues) => {
    const totalValue = parseFloat(simulation.totalValue);
    const monthlySavings = parseFloat(simulation.monthlySavings);
    const checkedMonths = Object.keys(monthValues).filter(month => monthValues[month]).length;
    const totalSavings = checkedMonths * monthlySavings;
    const remainingValue = totalValue - totalSavings;
    return Math.max(0, remainingValue);
  };

  return (
    <div className="page-container">
      <div className="simulation-container">
        <div className="simulation-form">
          <h2>Criar Simulação</h2>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Nome da simulação"
          />
          <input
            type="number"
            placeholder="Valor total do item/meta"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
            onKeyDown={validateNumberInput}
            aria-label="Valor total do item/meta"
          />
          <input
            type="number"
            placeholder="Valor mensal que você pode economizar"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(e.target.value)}
            onKeyDown={validateNumberInput}
            aria-label="Valor mensal para economizar"
          />
          <button className="simulation-form-button" onClick={handleStartSimulation} aria-label="Calcular meses necessários para atingir a meta">Iniciar Simulação</button>
          {monthsToSave !== null && (
            <div>
              <p className="simulation-result">Tempo estimado para alcançar a meta: {monthsToSave} meses</p>
              <button className="simulation-form-button save-simulation" onClick={handleSaveSimulation} aria-label="Salvar a simulação">Salvar Simulação</button>
              <button className="restart-simulation" onClick={handleRestartSimulation} aria-label="Reiniciar o formulário">Reiniciar Simulação</button>
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
                      <span className="monthly-savings">R$ {parseFloat(simulation.monthlySavings).toFixed(2)}/mês</span>
                    </div>
                    <div className="simulation-actions">
                      <button className="toggle-button" onClick={() => toggleDetails(simulation.id)} aria-label={`Expandir detalhes da simulação ${simulation.name}`}>
                        {activeItem === simulation.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteSimulation(simulation.id)} aria-label={`Excluir simulação ${simulation.name}`}>
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
                              aria-label={`Mês ${month} - ${simulation.monthValues[month] ? 'Selecionado' : 'Não selecionado'}`}
                            />
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="simulation-total">
                      Total restante: R$ {simulation.remainingValue.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;