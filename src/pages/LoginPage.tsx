import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    // 실제 카카오 로그인 로직은 여기에 구현
    // 현재는 모의 로그인으로 처리
    setTimeout(() => {
      setIsLoading(false);
      navigate("/auth");
    }, 1500);
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