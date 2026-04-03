import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { dashboardService } from '../services/api';

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#f4f6f8',
    margin: 0,
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  yearInput: {
    width: '120px',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
    border: '1px solid rgba(145, 158, 171, 0.32)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#00A76F',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
    marginBottom: 0,
  },
  card: {
    backgroundColor: '#1f2326',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cardIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '14px',
    color: '#b0b8c1',
    marginBottom: '4px',
    fontWeight: 500,
  },
  cardValue: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#f4f6f8',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '18px',
    marginBottom: 0,
  },
  chartCard: {
    backgroundColor: '#1f2326',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f4f6f8',
    marginBottom: '24px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#b0b8c1',
  },
  error: {
    backgroundColor: '#2d1a1a',
    color: '#ff6f6f',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '18px',
  },
  panel: {
    backgroundColor: '#1f2326',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#f4f6f8',
    marginTop: 0,
    marginBottom: '14px',
  },
  list: {
    margin: 0,
    paddingLeft: '18px',
    color: '#c5cdd5',
    fontSize: '14px',
  },
  listItem: {
    marginBottom: '8px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    color: '#9BA7B2',
    fontWeight: 600,
    padding: '0 10px 10px',
    borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
  },
  td: {
    color: '#DEE5EC',
    padding: '10px',
    borderBottom: '1px solid rgba(145, 158, 171, 0.12)',
    whiteSpace: 'nowrap',
  },
  validationOk: {
    color: '#5BE49B',
    fontWeight: 600,
    marginBottom: '10px',
  },
  validationWarn: {
    color: '#FFAB00',
    fontWeight: 600,
    marginBottom: '10px',
  },
};

const colors = {
  blue: '#1877F2',
  purple: '#8E33FF',
  yellow: '#FFAB00',
  red: '#FF5630',
  green: '#00A76F',
  cyan: '#00B8D9',
};

const chartTextColor = '#334155';

const CardIcon = ({ type, bgColor }) => {
  const iconStyles = {
    ...styles.cardIcon,
    backgroundColor: `${bgColor}14`,
    color: bgColor,
  };

  const icons = {
    vendedores: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    ingressos: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z" />
      </svg>
    ),
    faturamento: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
    comissoes: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
      </svg>
    ),
    caixa: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    alerta: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
    evento: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
      </svg>
    ),
    equipamentos: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
      </svg>
    ),
  };

  return <div style={iconStyles}>{icons[type]}</div>;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};

const formatDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR');
};

const isEntrada = (tipo = '') => String(tipo).toUpperCase().includes('ENTRADA');
const INITIAL_YEAR = new Date().getFullYear();

const getMockData = () => ({
  financeiro: {
    totalReceitas: 150000,
    totalDespesas: 50000,
    saldoLiquido: 100000,
    saldoTotalCaixa: 95000,
    entradasMesAtual: 45000,
    saidasMesAtual: 15000,
    resultadoMesAtual: 30000,
    receitas_validadas: true,
    despesas_validadas: true,
    validationMessage: null,
    contas: [
      { id: 1, nome: 'Conta Principal', banco: 'Banco do Brasil', saldoAtual: 95000, principal: true },
    ],
    fluxoCaixa: [
      {
        id: 101,
        data: '2026-03-28',
        tipo: 'ENTRADA',
        valor: 15000,
        descricao: 'Bilheteria',
        categoria: 'Bilheteria',
        conta: 'Conta Principal',
      },
      {
        id: 102,
        data: '2026-03-30',
        tipo: 'SAIDA',
        valor: 4000,
        descricao: 'Fornecedor audio',
        categoria: 'Operacional',
        conta: 'Conta Principal',
      },
    ],
  },
  kpis: {
    totalVendedores: 150,
    totalVendedoresAtivos: 145,
    totalIngressosVendidos: 5000,
    faturamentoTotal: 150000,
    comissoesTotais: 7500,
    ticketMedio: 30,
    totalComissarios: 50,
    totalPontosVenda: 80,
    totalEscritorios: 20,
    totalEquipamentos: 25,
    equipamentosAtivos: 24,
    equipamentosDisponiveis: 20,
    top10Vendedores: [
      {
        vendedorId: 1,
        nome: 'Joao Silva',
        cidade: 'Sao Paulo',
        tipoVendedor: 'PDV',
        totalIngressosVendidos: 500,
        totalFaturamento: 15000,
        valorComissao: 750,
        ticketMedio: 30,
      },
      {
        vendedorId: 2,
        nome: 'Maria Santos',
        cidade: 'Campinas',
        tipoVendedor: 'Comissario',
        totalIngressosVendidos: 430,
        totalFaturamento: 12900,
        valorComissao: 645,
        ticketMedio: 30,
      },
    ],
  },
  alertas: {
    totalPagamentosVencendo: 5,
    valorTotalVencendo: 25000,
    pagamentosVencidosHoje: 2,
    pagamentosVencendoAmanha: 1,
    pagamentosVencendo7Dias: 5,
    pagamentosUrgentes: [
      { id: 1, descricao: 'Fornecedor XYZ', valor: 10000, dataVencimento: '2026-04-05' },
    ],
  },
  contagemEvento: {
    nomeEvento: 'Evento Principal 2026',
    dataEvento: '2026-12-25',
    diasRestantes: 267,
    semanasRestantes: 38,
    mesesRestantes: 8,
    jaAconteceu: false,
  },
  versao: '2.0',
  timestamp: '2026-04-02T22:45:30.123456',
});

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);

  useEffect(() => {
    fetchDashboard(INITIAL_YEAR);
  }, []);

  const fetchDashboard = async (ano) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard(ano);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard. Verifique se o backend esta rodando.');
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const financeiro = dashboardData?.financeiro || {};
  const kpis = dashboardData?.kpis || {};
  const alertas = dashboardData?.alertas || {};
  const contagemEvento = dashboardData?.contagemEvento || {};

  const fluxoOrdenado = useMemo(
    () => [...(financeiro.fluxoCaixa || [])].sort((a, b) => new Date(a.data) - new Date(b.data)),
    [financeiro.fluxoCaixa]
  );

  const top5Vendedores = (kpis.top10Vendedores || []).slice(0, 5);

  const fluxoCategorias =
    fluxoOrdenado.length > 0
      ? fluxoOrdenado.map((mov) => formatDate(mov.data))
      : ['Mes atual'];

  const entradasSerie =
    fluxoOrdenado.length > 0
      ? fluxoOrdenado.map((mov) => (isEntrada(mov.tipo) ? Number(mov.valor || 0) : 0))
      : [Number(financeiro.entradasMesAtual || 0)];

  const saidasSerie =
    fluxoOrdenado.length > 0
      ? fluxoOrdenado.map((mov) => (!isEntrada(mov.tipo) ? Number(mov.valor || 0) : 0))
      : [Number(financeiro.saidasMesAtual || 0)];

  const vendedorPerfis = [
    Number(kpis.totalComissarios || 0),
    Number(kpis.totalPontosVenda || 0),
    Number(kpis.totalEscritorios || 0),
  ];
  const hasPerfisData = vendedorPerfis.some((value) => value > 0);

  const fluxoChartOptions = {
    chart: {
      type: 'line',
      fontFamily: 'Public Sans, sans-serif',
      foreColor: chartTextColor,
      toolbar: { show: false },
    },
    colors: [colors.green, colors.red],
    legend: {
      labels: {
        colors: chartTextColor,
      },
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth',
    },
    xaxis: {
      categories: fluxoCategorias,
      labels: {
        style: { fontFamily: 'Public Sans, sans-serif', colors: chartTextColor },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: { fontFamily: 'Public Sans, sans-serif', colors: chartTextColor },
      },
    },
    tooltip: { y: { formatter: (value) => formatCurrency(value) } },
    dataLabels: { enabled: false },
  };

  const fluxoChartSeries = [
    { name: 'Entradas', data: entradasSerie },
    { name: 'Saidas', data: saidasSerie },
  ];

  const barChartOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Public Sans, sans-serif',
      foreColor: chartTextColor,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories:
        top5Vendedores.length > 0
          ? top5Vendedores.map((v) => (v.nome || '-').split(' ')[0])
          : ['Sem dados'],
      labels: {
        style: {
          fontFamily: 'Public Sans, sans-serif',
          colors: chartTextColor,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: {
          fontFamily: 'Public Sans, sans-serif',
          colors: chartTextColor,
        },
      },
    },
    colors: [colors.blue],
    grid: {
      borderColor: 'rgba(145, 158, 171, 0.2)',
      strokeDashArray: 3,
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
  };

  const barChartSeries = [
    {
      name: 'Faturamento',
      data:
        top5Vendedores.length > 0
          ? top5Vendedores.map((v) => Number(v.totalFaturamento || 0))
          : [0],
    },
  ];

  const perfilChartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Public Sans, sans-serif',
    },
    labels: ['Comissarios', 'PDVs', 'Escritorios'],
    colors: [colors.blue, colors.cyan, colors.purple],
    legend: {
      position: 'bottom',
      fontFamily: 'Public Sans, sans-serif',
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '66%',
        },
      },
    },
    stroke: { width: 0 },
  };

  const perfilChartSeries = hasPerfisData ? vendedorPerfis : [1, 0, 0];

  const dadosValidados = Boolean(financeiro.receitas_validadas && financeiro.despesas_validadas);

  if (loading) {
    return <div style={styles.loading}>Carregando dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Unificado</h1>
        <div style={styles.filters}>
          <input
            type="number"
            min="2000"
            max="2100"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value || new Date().getFullYear()))}
            style={styles.yearInput}
            aria-label="Ano"
          />
          <button style={styles.button} onClick={() => fetchDashboard(selectedYear)} type="button">
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <br />
          <small>Exibindo dados de demonstracao.</small>
        </div>
      )}

      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <CardIcon type="vendedores" bgColor={colors.blue} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Total Vendedores</div>
            <div style={styles.cardValue}>{formatNumber(kpis.totalVendedores)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="ingressos" bgColor={colors.purple} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Ingressos Vendidos</div>
            <div style={styles.cardValue}>{formatNumber(kpis.totalIngressosVendidos)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="faturamento" bgColor={colors.yellow} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Faturamento Total</div>
            <div style={styles.cardValue}>{formatCurrency(kpis.faturamentoTotal)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="comissoes" bgColor={colors.red} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Comissoes Totais</div>
            <div style={styles.cardValue}>{formatCurrency(kpis.comissoesTotais)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="caixa" bgColor={colors.green} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Saldo Total Caixa</div>
            <div style={styles.cardValue}>{formatCurrency(financeiro.saldoTotalCaixa)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="alerta" bgColor={colors.red} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Pagamentos Urgentes (7 dias)</div>
            <div style={styles.cardValue}>{formatNumber(alertas.pagamentosVencendo7Dias)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="evento" bgColor={colors.cyan} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Dias para Evento</div>
            <div style={styles.cardValue}>{formatNumber(contagemEvento.diasRestantes)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <CardIcon type="equipamentos" bgColor={colors.blue} />
          <div style={styles.cardContent}>
            <div style={styles.cardTitle}>Equipamentos Ativos</div>
            <div style={styles.cardValue}>{formatNumber(kpis.equipamentosAtivos)}</div>
          </div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Fluxo de Caixa Recente</h3>
          <Chart options={fluxoChartOptions} series={fluxoChartSeries} type="line" height={320} />
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Top 5 Vendedores</h3>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={320} />
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Perfil de Vendedores</h3>
          <Chart options={perfilChartOptions} series={perfilChartSeries} type="donut" height={320} />
        </div>
      </div>

      <div style={styles.sectionGrid}>
        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Validacao Financeira</h3>
          <div style={dadosValidados ? styles.validationOk : styles.validationWarn}>
            {dadosValidados ? 'Dados validados com sucesso' : 'Atencao: existem divergencias'}
          </div>
          {!dadosValidados && financeiro.validationMessage && (
            <div style={{ color: '#FFAB00', marginBottom: '10px' }}>{financeiro.validationMessage}</div>
          )}
          <ul style={styles.list}>
            <li style={styles.listItem}>Receitas: {formatCurrency(financeiro.totalReceitas)}</li>
            <li style={styles.listItem}>Despesas: {formatCurrency(financeiro.totalDespesas)}</li>
            <li style={styles.listItem}>Saldo liquido: {formatCurrency(financeiro.saldoLiquido)}</li>
            <li style={styles.listItem}>Entradas do mes: {formatCurrency(financeiro.entradasMesAtual)}</li>
            <li style={styles.listItem}>Saidas do mes: {formatCurrency(financeiro.saidasMesAtual)}</li>
            <li style={styles.listItem}>Resultado do mes: {formatCurrency(financeiro.resultadoMesAtual)}</li>
          </ul>
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Contagem Regressiva do Evento</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Evento: {contagemEvento.nomeEvento || '-'}</li>
            <li style={styles.listItem}>Data: {formatDate(contagemEvento.dataEvento)}</li>
            <li style={styles.listItem}>Dias restantes: {formatNumber(contagemEvento.diasRestantes)}</li>
            <li style={styles.listItem}>Semanas restantes: {formatNumber(contagemEvento.semanasRestantes)}</li>
            <li style={styles.listItem}>Meses restantes: {formatNumber(contagemEvento.mesesRestantes)}</li>
            <li style={styles.listItem}>{contagemEvento.jaAconteceu ? 'Evento ja aconteceu' : 'Evento futuro'}</li>
          </ul>
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Contas Bancarias</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Conta</th>
                  <th style={styles.th}>Banco</th>
                  <th style={styles.th}>Saldo</th>
                  <th style={styles.th}>Principal</th>
                </tr>
              </thead>
              <tbody>
                {(financeiro.contas || []).length > 0 ? (
                  (financeiro.contas || []).map((conta) => (
                    <tr key={conta.id}>
                      <td style={styles.td}>{conta.nome || '-'}</td>
                      <td style={styles.td}>{conta.banco || '-'}</td>
                      <td style={styles.td}>{formatCurrency(conta.saldoAtual)}</td>
                      <td style={styles.td}>{conta.principal ? 'Sim' : 'Nao'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      Nenhuma conta encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Pagamentos Urgentes</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Descricao</th>
                  <th style={styles.th}>Valor</th>
                  <th style={styles.th}>Vencimento</th>
                </tr>
              </thead>
              <tbody>
                {(alertas.pagamentosUrgentes || []).length > 0 ? (
                  (alertas.pagamentosUrgentes || []).map((pagamento) => (
                    <tr key={pagamento.id}>
                      <td style={styles.td}>{pagamento.descricao || '-'}</td>
                      <td style={styles.td}>{formatCurrency(pagamento.valor)}</td>
                      <td style={styles.td}>{formatDate(pagamento.dataVencimento)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={3}>
                      Nenhum pagamento urgente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Vencidos hoje: {formatNumber(alertas.pagamentosVencidosHoje)}
            </li>
            <li style={styles.listItem}>
              Vencem amanha: {formatNumber(alertas.pagamentosVencendoAmanha)}
            </li>
            <li style={styles.listItem}>
              Valor total vencendo: {formatCurrency(alertas.valorTotalVencendo)}
            </li>
          </ul>
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Top 10 Vendedores</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Ingressos</th>
                  <th style={styles.th}>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {(kpis.top10Vendedores || []).length > 0 ? (
                  (kpis.top10Vendedores || []).map((vendedor) => (
                    <tr key={vendedor.vendedorId || vendedor.nome}>
                      <td style={styles.td}>{vendedor.nome || '-'}</td>
                      <td style={styles.td}>{vendedor.tipoVendedor || '-'}</td>
                      <td style={styles.td}>{formatNumber(vendedor.totalIngressosVendidos)}</td>
                      <td style={styles.td}>{formatCurrency(vendedor.totalFaturamento)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      Sem vendedores no periodo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Fluxo de Caixa (ultimos registros)</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Descricao</th>
                  <th style={styles.th}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {fluxoOrdenado.length > 0 ? (
                  fluxoOrdenado.map((mov) => (
                    <tr key={mov.id}>
                      <td style={styles.td}>{formatDate(mov.data)}</td>
                      <td style={styles.td}>{mov.tipo || '-'}</td>
                      <td style={styles.td}>{mov.descricao || '-'}</td>
                      <td style={styles.td}>{formatCurrency(mov.valor)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      Sem movimentacoes no periodo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section style={styles.panel}>
        <h3 style={styles.panelTitle}>Metadados da Resposta</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Versao: {dashboardData?.versao || '-'}</li>
          <li style={styles.listItem}>Timestamp: {dashboardData?.timestamp || '-'}</li>
          <li style={styles.listItem}>Ano consultado: {selectedYear}</li>
        </ul>
      </section>
    </div>
  );
}
