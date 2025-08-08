import { supabase } from './supabase'

export interface User {
  id: string        // email
  name: string      // 카카오 닉네임
  profile_url?: string  // 프로필 이미지 링크
  created_at?: string
  updated_at?: string
}

export const users = {
  // 유저 정보 가져오기
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // 유저 정보 생성/업데이트
  upsertUser: async (user: Omit<User, 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('users')
      .upsert([{
        id: user.id,           // email
        name: user.name,       // 카카오 닉네임
        profile_url: user.profile_url  // 프로필 이미지 링크
      }], { onConflict: 'id' })
      .select()
      .single()
    
    return { data, error }
  },

  // 유저 정보 업데이트
  updateUser: async (userId: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  }
} 