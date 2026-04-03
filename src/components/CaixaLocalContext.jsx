import { createContext, useMemo, useRef, useState } from 'react';

export const CaixaLocalContext = createContext({
  saldoLocal: 0,
  saldosPorConta: {},
  setSaldoInicialContas: () => {},
  registrarEntrada: () => {},
  registrarSaida: () => {},
  registrarTransferencia: () => {},
  resetCaixa: () => {},
});

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function CaixaLocalProvider({ children }) {
  const [saldoLocal, setSaldoLocal] = useState(0);
  const [saldosPorConta, setSaldosPorConta] = useState({});
  const appliedKeysRef = useRef(new Set());

  const registerOnce = (key, action) => {
    if (!key) {
      action();
      return;
    }

    if (appliedKeysRef.current.has(key)) {
      return;
    }

    appliedKeysRef.current.add(key);
    action();
  };

  const setSaldoInicialContas = (contas = []) => {
    const nextSaldos = {};
    let total = 0;

    contas.forEach((conta) => {
      const contaId = conta?.id;
      if (!contaId) return;
      const saldoConta = toNumber(conta?.saldoAtual);
      nextSaldos[contaId] = saldoConta;
      total += saldoConta;
    });

    setSaldosPorConta(nextSaldos);
    setSaldoLocal(total);
  };

  const registrarEntrada = ({ valor, contaDestinoId, contaId, key }) => {
    const valorNumerico = toNumber(valor);
    if (valorNumerico <= 0) return;

    registerOnce(key, () => {
      const contaAlvo = contaDestinoId || contaId;
      setSaldoLocal((current) => current + valorNumerico);
      if (contaAlvo) {
        setSaldosPorConta((current) => ({
          ...current,
          [contaAlvo]: toNumber(current[contaAlvo]) + valorNumerico,
        }));
      }
    });
  };

  const registrarSaida = ({ valor, contaOrigemId, contaId, key }) => {
    const valorNumerico = toNumber(valor);
    if (valorNumerico <= 0) return;

    registerOnce(key, () => {
      const contaAlvo = contaOrigemId || contaId;
      setSaldoLocal((current) => current - valorNumerico);
      if (contaAlvo) {
        setSaldosPorConta((current) => ({
          ...current,
          [contaAlvo]: toNumber(current[contaAlvo]) - valorNumerico,
        }));
      }
    });
  };

  const registrarTransferencia = ({ valor, contaOrigemId, contaDestinoId, key }) => {
    const valorNumerico = toNumber(valor);
    if (valorNumerico <= 0 || !contaOrigemId || !contaDestinoId) return;

    registerOnce(key, () => {
      setSaldosPorConta((current) => ({
        ...current,
        [contaOrigemId]: toNumber(current[contaOrigemId]) - valorNumerico,
        [contaDestinoId]: toNumber(current[contaDestinoId]) + valorNumerico,
      }));
    });
  };

  const resetCaixa = () => {
    appliedKeysRef.current = new Set();
    setSaldosPorConta({});
    setSaldoLocal(0);
  };

  const value = useMemo(
    () => ({
      saldoLocal,
      saldosPorConta,
      setSaldoInicialContas,
      registrarEntrada,
      registrarSaida,
      registrarTransferencia,
      resetCaixa,
    }),
    [saldoLocal, saldosPorConta]
  );

  return <CaixaLocalContext.Provider value={value}>{children}</CaixaLocalContext.Provider>;
}
