import { supabase } from './supabase'

export interface User {
  id: string        // email
  email?: string    // email (중복이지만 호환성을 위해 유지)
  name?: string     // 카카오 닉네임
  profile_url?: string  // 프로필 이미지 링크
  provider?: string
}

export const auth = {
  // 카카오 로그인 (OAuth) - 이메일 요청 없이
  signInWithKakao: async () => {
    console.log('=== auth.ts: 카카오 로그인 시작 ===');
    console.log('auth.ts: 현재 origin:', window.location.origin);
    console.log('auth.ts: redirectTo URL:', `${window.location.origin}/auth`);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            // 이메일 요청 완전 제거
            scope: 'profile_nickname profile_image'
          }
        }
      })
      
      console.log('auth.ts: Supabase OAuth 응답 - data:', data);
      console.log('auth.ts: Supabase OAuth 응답 - error:', error);
      console.log('auth.ts: 전체 응답 객체:', { data, error });
      
      if (error) {
        console.error('auth.ts: 카카오 로그인 오류 발생:', error);
      } else {
        console.log('auth.ts: 카카오 로그인 성공, 리다이렉트 대기 중...');
      }
      
      return { data, error }
    } catch (catchError) {
      console.error('auth.ts: 카카오 로그인 예외 발생:', catchError);
      return { data: null, error: catchError }
    }
  },

  // 로그아웃
  signOut: async () => {
    console.log('로그아웃 시작');
    const { error } = await supabase.auth.signOut()
    if (!error) {
      console.log('Supabase 세션 제거 성공');
      localStorage.removeItem('user')
      console.log('로컬 스토리지 사용자 정보 제거 완료');
    } else {
      console.error('Supabase 세션 제거 실패:', error);
    }
    console.log('로그아웃 완료');
    return { error }
  },

  // 현재 사용자 가져오기
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 인증 상태 변경 감지
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user: User = {
          id: session.user.email || session.user.id,  // email을 id로 사용
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.nickname,
          profile_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          provider: session.user.app_metadata?.provider
        }
        localStorage.setItem('user', JSON.stringify(user))
        callback(user)
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user')
        callback(null)
      }
    })
  },

  // OAuth 리다이렉트 처리
  handleAuthRedirect: async () => {
    try {
      console.log('OAuth 리다이렉트 처리 시작');
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('세션 가져오기 오류:', error)
        return { user: null, error }
      }
      
      console.log('세션 데이터:', data);
      console.log('사용자 데이터:', data.session?.user);
      
      if (data.session?.user) {
        const user: User = {
          id: data.session.user.email || data.session.user.id,  // email을 id로 사용
          email: data.session.user.email,
          name: data.session.user.user_metadata?.name || data.session.user.user_metadata?.nickname,
          profile_url: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture,
          provider: data.session.user.app_metadata?.provider
        }
        localStorage.setItem('user', JSON.stringify(user))
        console.log('OAuth 로그인 성공, 저장된 사용자:', user)
        return { user, error: null }
      }
      console.log('OAuth 세션 없음')
      return { user: null, error }
    } catch (error) {
      console.error('OAuth 리다이렉트 처리 오류:', error)
      return { user: null, error }
    }
  }
} 