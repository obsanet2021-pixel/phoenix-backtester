import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTrade, listTrades } from '../services/trades'

const select = vi.fn()
const order = vi.fn()
const insert = vi.fn()

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      select,
      order,
      insert,
    })),
  },
}))

vi.mock('../lib/errorLogger', () => ({
  logEvent: vi.fn(),
  logWarning: vi.fn(),
}))

describe('trade service', () => {
  beforeEach(() => {
    localStorage.clear()
    select.mockReset()
    order.mockReset()
    insert.mockReset()
  })

  it('normalizes fetched trades from Supabase', async () => {
    order.mockResolvedValue({
      data: [
        {
          id: 'trade-1',
          pair: 'EURUSD',
          type: 'Long',
          timeframe: 'M15',
          entry_price: 1.08,
          exit_price: 1.09,
          stop_loss: 1.07,
          take_profit: 1.1,
          position_size: 0.5,
          pnl_amount: 120,
          status: 'closed',
          opened_at: '2026-04-18T10:00:00.000Z',
          metadata: {},
        },
      ],
      error: null,
    })
    select.mockReturnValue({ order })

    const trades = await listTrades('user-1')

    expect(trades[0].pair).toBe('EUR/USD')
    expect(trades[0].type).toBe('BUY')
  })

  it('returns the created trade after a remote insert', async () => {
    insert.mockReturnValue({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: {
              id: 'trade-2',
              pair: 'GBPUSD',
              type: 'Short',
              timeframe: 'M15',
              entry_price: 1.25,
              exit_price: null,
              stop_loss: 1.26,
              take_profit: 1.24,
              position_size: 1,
              pnl_amount: 0,
              status: 'open',
              opened_at: '2026-04-18T10:00:00.000Z',
              metadata: {},
            },
            error: null,
          }),
      }),
    })

    const trade = await createTrade(
      {
        pair: 'GBP/USD',
        type: 'SELL',
        entry: 1.25,
        sl: 1.26,
        tp: 1.24,
        size: 1,
      },
      'user-1',
    )

    expect(trade.id).toBe('trade-2')
    expect(trade.pair).toBe('GBP/USD')
  })
})
