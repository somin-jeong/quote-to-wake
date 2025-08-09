import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { users } from "@/lib/users";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // OAuth 리다이렉트 처리
    const handleOAuthRedirect = async () => {
      console.log('LoginPage: OAuth 리다이렉트 처리 시작');
      
      // URL에서 auth 관련 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('access_token') || urlParams.has('refresh_token') || window.location.hash.includes('access_token');
      
      if (hasAuthParams) {
        console.log('LoginPage: OAuth 파라미터 감지됨, 인증 처리 시작');
        try {
          const { user, error } = await auth.handleAuthRedirect();
          console.log('LoginPage: OAuth 인증 결과:', { user, error });
          
          if (user) {
            console.log('LoginPage: 사용자 정보 저장 시작');
            // 유저 정보를 Supabase에 저장
            const { error: userError } = await users.upsertUser({
              id: user.id,
              name: user.name || '익명',
              profile_url: user.profile_url
            });
            
            if (userError) {
              console.error('LoginPage: 유저 정보 저장 오류:', userError);
            } else {
              console.log('LoginPage: 유저 정보 저장 성공');
            }
            
            // 로컬 스토리지에 사용자 정보 저장
            localStorage.setItem('user', JSON.stringify(user));
            console.log('LoginPage: 로컬 스토리지에 사용자 정보 저장 완료');
            
            navigate('/auth');
          } else {
            console.log('LoginPage: 사용자 정보 없음, 로그인 실패');
          }
        } catch (error) {
          console.error('LoginPage: OAuth 처리 중 오류:', error);
        }
      } else {
        // 일반적인 로컬 스토리지 확인
        const localUser = localStorage.getItem('user');
        if (localUser) {
          console.log('LoginPage: 기존 사용자 정보 발견, 인증 페이지로 이동');
          navigate('/auth');
        }
      }
    };
    
    handleOAuthRedirect();
  }, [navigate]);

  const handleKakaoLogin = async () => {
    console.log('카카오 로그인 버튼 클릭');
    setIsLoading(true);
    try {
      const { error } = await auth.signInWithKakao();
      console.log('카카오 로그인 응답:', { error });
      
      if (error) {
        console.error('카카오 로그인 오류:', error);
        toast({
          title: "로그인 실패",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('카카오 로그인 성공, OAuth 리다이렉트 대기 중...');
        // OAuth 리다이렉트를 기다리므로 여기서는 아무것도 하지 않음
        // useEffect에서 OAuth 리다이렉트를 처리함
      }
    } catch (error) {
      console.error('카카오 로그인 예외:', error);
      toast({
        title: "로그인 오류",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-card backdrop-blur-sm shadow-soft border-0">
        <div className="text-center space-y-8">
          {/* 로고/아이콘 영역 */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-morning rounded-full mx-auto flex items-center justify-center shadow-glow">
              <span className="text-3xl">🌅</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">기상 인증</h1>
            <p className="text-muted-foreground">
              매일 아침, 명언과 함께 시작하세요
            </p>
          </div>

          {/* 카카오 로그인 버튼 */}
          <div className="space-y-4">
            <Button
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  카카오톡으로 시작하기
                </div>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              카카오톡 계정으로 간편하게 시작하세요
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;