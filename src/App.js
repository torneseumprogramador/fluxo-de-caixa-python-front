import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [extrato, setExtrato] = useState([]);
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [tipoBusca, setTipoBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState('1'); // Defaul é 'Receita'

  useEffect(() => {
    fetchData();
  }, [tipoBusca]);

  const fetchData = async () => {
    try {
      let url = `${apiURL}/api/caixas`;
      if (tipoBusca) {
        url += `?tipo=${tipoBusca}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setExtrato(data.extrato);
      setReceitas(data.receitas);
      setDespesas(data.despesas);
      setValorTotal(data.valor_total);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleBuscar = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleExcluir = async (id) => {
    if(window.confirm('Confirma?')){
      try {
        const response = await fetch(`${apiURL}/api/caixas/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchData();
        } else {
          console.error('Erro ao excluir:', response);
        }
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiURL}/api/caixas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo, valor: parseFloat(valor), status: parseInt(status) }),
      });

      if (response.ok) {
        fetchData();
        setShowForm(false);
        setTipo('');
        setValor('');
        setStatus('1');
      } else {
        console.error('Erro ao cadastrar:', response);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="mt-4">Fluxo de caixa em Python</h1>
      <hr />

      <div className="row mt-4 dvCaixas">
        <div className="col-md-4">
          <h4>Valor total</h4>
          <p>R$ {valorTotal.toFixed(2)}</p>
        </div>
        <div className="col-md-4">
          <h4>Receitas</h4>
          <p>R$ {receitas.toFixed(2)}</p>
        </div>
        <div className="col-md-4">
          <h4>Despesas</h4>
          <p>R$ {despesas.toFixed(2)}</p>
        </div>
      </div>

      <div className="row mt-4 dvBusca">
        <div className="col-md-6">
          <form onSubmit={handleBuscar} className="d-flex">
            <input
              type="text"
              name="tipo"
              placeholder="Digite algo ..."
              value={tipoBusca}
              onChange={(e) => setTipoBusca(e.target.value)}
              className="form-control mr-2"
            />
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </form>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          {showForm ? (
            <button onClick={() => setShowForm(false)} className="btn btn-danger">
              Cancelar
            </button>
          ) : (
            <button onClick={() => setShowForm(true)} className="btn btn-success">
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <div className="row mt-4">
          <hr></hr>
          <div className="col-md-6" style={{ marginBottom: '10px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tipo">Tipo:</label>
                <input
                  type="text"
                  className="form-control"
                  id="tipo"
                  name="tipo"
                  required
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="valor">Valor:</label>
                <input
                  type="number"
                  className="form-control"
                  id="valor"
                  name="valor"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="1">Receita</option>
                  <option value="0">Despesa</option>
                </select>
              </div>
              <br />
              <button type="submit" className="btn btn-primary">
                Cadastrar
              </button>
            </form>
          </div>
          <hr></hr>
        </div>
      )}

      <div className="row mt-4 dvTabela">
        <div className="col-md-12">
          <table>
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Valor</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {extrato.map((caixa) => (
                <tr key={caixa.id}>
                  <td>{caixa.tipo}</td>
                  <td>R$ {caixa.valor.toFixed(2)}</td>
                  <td style={{ backgroundColor: caixa.status === 1 ? '#8aabe0' : 'red' }}>
                    {caixa.status === 1 ? 'Receita' : 'Despesa'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleExcluir(caixa.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
