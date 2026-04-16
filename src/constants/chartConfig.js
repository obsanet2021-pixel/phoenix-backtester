export const CHART_CONFIG = {
  LIGHTWEIGHT: {
    width: 800,
    height: 500,
    layout: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
    },
    grid: {
      vertLines: { color: '#f0f0f0' },
      horzLines: { color: '#f0f0f0' },
    }
  },
  TRADINGVIEW: {
    interval: 'D',
    timezone: 'Etc/UTC',
    style: '1',
    toolbarBg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: 'tradingview_chart'
  }
};
