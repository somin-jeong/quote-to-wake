import { supabase } from './supabase'

export interface RankingRecord {
  id?: number
  user_id: string
  user_name: string
  auth_time: string
  auth_date: string
  quote: string
  created_at?: string
}

export const ranking = {
  // 오늘의 랭킹 가져오기
  getTodayRankings: async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('auth_date', today)
      .order('auth_time', { ascending: true })
      .limit(50)
    
    return { data, error }
  },

  // 랭킹 기록 추가
  addRanking: async (record: Omit<RankingRecord, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('rankings')
      .insert([record])
      .select()
    
    return { data, error }
  },

  // 사용자의 오늘 인증 여부 확인
  checkTodayAuth: async (userId: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('user_id', userId)
      .eq('auth_date', today)
      .single()
    
    return { data, error }
  },

  // 사용자의 랭킹 순위 가져오기
  getUserRank: async (userId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('auth_date', targetDate)
      .order('auth_time', { ascending: true })
    
    if (error) return { rank: null, error }
    
    const userIndex = data?.findIndex(record => record.user_id === userId)
    const rank = userIndex !== -1 ? userIndex + 1 : null
    
    return { rank, error: null }
  }
} 