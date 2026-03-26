import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { dashboardService } from '../services/api';

// Estilos inline
const styles = {
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#f4f6f8',
    marginBottom: '24px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#23272a',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cardIcon: {
    width: '64px',
    height: '64px',
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
    fontSize: '24px',
    fontWeight: 700,
    color: '#f4f6f8',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  chartCard: {
    backgroundColor: '#23272a',
    borderRadius: '16px',
    padding: '24px',
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
};

// Cores do tema baseadas na imagem
const colors = {
  blue: '#1877F2',
  purple: '#8E33FF',
  yellow: '#FFAB00',
  red: '#FF5630',
  green: '#00A76F',
  cyan: '#00B8D9',
};

// Icones para os cards
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
  };

  return <div style={iconStyles}>{icons[type]}</div>;
};

// Formatar valores monetarios
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar numeros grandes
const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getCompleto();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard. Verifique se o backend esta rodando.');
      // Carregar dados mockados para demonstracao
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Dados mockados para quando a API nao estiver disponivel
  const getMockData = () => ({
    kpis: {
      totalVendedores: 125,
      totalVendedoresAtivos: 98,
      totalIngressosVendidos: 4920,
      faturamentoTotal: 156780.5,
      comissoesTotais: 15678.05,
      ticketMedio: 31.87,
      totalComissarios: 45,
      totalPontosVenda: 80,
      top10Vendedores: [
        { nome: 'Joao Silva', totalFaturamento: 25000, totalIngressosVendidos: 150 },
        { nome: 'Maria Santos', totalFaturamento: 22000, totalIngressosVendidos: 130 },
        { nome: 'Pedro Souza', totalFaturamento: 18000, totalIngressosVendidos: 120 },
        { nome: 'Ana Costa', totalFaturamento: 15000, totalIngressosVendidos: 100 },
        { nome: 'Carlos Lima', totalFaturamento: 12000, totalIngressosVendidos: 90 },
      ],
    },
    saldoCaixa: 89500.0,
    entradasMes: 156780.5,
    saidasMes: 67280.5,
    resultadoMes: 89500.0,
    receitasPorTipo: [
      { label: 'Bilheteria', valor: 95000, percentual: 60.6 },
      { label: 'Patrocinio', valor: 35000, percentual: 22.3 },
      { label: 'Bar', valor: 18000, percentual: 11.5 },
      { label: 'Outras', valor: 8780, percentual: 5.6 },
    ],
    despesasPorCategoria: [
      { label: 'Producao', valor: 25000, percentual: 37.2 },
      { label: 'Marketing', valor: 18000, percentual: 26.8 },
      { label: 'Logistica', valor: 15000, percentual: 22.3 },
      { label: 'Outros', valor: 9280, percentual: 13.7 },
    ],
  });

  const kpis = dashboardData?.kpis || {};

  // Dados para o grafico de pizza (Receitas por Tipo)
  const pieChartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Public Sans, sans-serif',
    },
    labels: dashboardData?.receitasPorTipo?.map((item) => item.label) || [
      'Bilheteria',
      'Patrocinio',
      'Bar',
      'Outras',
    ],
    colors: [colors.blue, colors.purple, colors.yellow, colors.red],
    legend: {
      position: 'bottom',
      fontFamily: 'Public Sans, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 600,
              formatter: () => formatCurrency(kpis.faturamentoTotal || 156780.5),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const pieChartSeries = dashboardData?.receitasPorTipo?.map((item) => item.valor) || [
    95000, 35000, 18000, 8780,
  ];

  // Dados para o grafico de barras (Top Vendedores)
  const barChartOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Public Sans, sans-serif',
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
      categories: (kpis.top10Vendedores || []).slice(0, 5).map((v) => v.nome?.split(' ')[0]) || [
        'Joao',
        'Maria',
        'Pedro',
        'Ana',
        'Carlos',
      ],
      labels: {
        style: {
          fontFamily: 'Public Sans, sans-serif',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: {
          fontFamily: 'Public Sans, sans-serif',
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
      data: (kpis.top10Vendedores || []).slice(0, 5).map((v) => v.totalFaturamento) || [
        25000, 22000, 18000, 15000, 12000,
      ],
    },
  ];

  if (loading) {
    return <div style={styles.loading}>Carregando dashboard...</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>

      {error && (
        <div style={styles.error}>
          {error}
          <br />
          <small>Exibindo dados de demonstracao.</small>
        </div>
      )}

      {/* Cards de KPIs */}
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
      </div>

      {/* Graficos */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Receitas por Tipo</h3>
          <Chart options={pieChartOptions} series={pieChartSeries} type="donut" height={350} />
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Top 5 Vendedores</h3>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
}
