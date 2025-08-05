import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const quotes = [
  "성공은 준비된 기회를 만났을 때 일어난다.",
  "오늘 하루도 최선을 다해 살아가자.",
  "작은 변화가 큰 차이를 만든다.",
  "매일 조금씩 나아지는 것이 완벽이다.",
  "새로운 하루, 새로운 기회가 시작된다.",
  "꿈을 이루기 위한 첫걸음을 내디뎌라.",
  "포기하지 말고 끝까지 해보자.",
  "오늘의 노력이 내일의 성과를 만든다."
];

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuote, setCurrentQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // 랜덤 명언 선택
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    
    // 현재 시간 설정
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    
    // 실시간으로 일치 여부 확인
    if (e.target.value === currentQuote) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleSubmit = () => {
    if (userInput === currentQuote) {
      // 인증 성공 로직
      const authTime = new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      // 로컬 스토리지에 오늘의 인증 기록 저장
      const today = new Date().toDateString();
      const authData = {
        date: today,
        time: authTime,
        quote: currentQuote
      };
      localStorage.setItem('todayAuth', JSON.stringify(authData));
      
      toast({
        title: "🎉 기상 인증 완료!",
        description: `${authTime}에 인증하셨습니다.`,
      });
      
      setTimeout(() => {
        navigate("/ranking");
      }, 2000);
    } else {
      toast({
        title: "⚠️ 인증 실패",
        description: "명언을 정확히 입력해주세요.",
        variant: "destructive"
      });
    }
  };

  const progress = Math.min((userInput.length / currentQuote.length) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-gradient-card backdrop-blur-sm shadow-soft border-0">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">기상 인증</h1>
            <p className="text-muted-foreground">
              현재 시간: {currentTime}
            </p>
          </div>

          {/* 명언 표시 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">오늘의 명언</h2>
            <Card className="p-6 bg-gradient-morning text-white shadow-glow">
              <p className="text-lg font-medium text-center leading-relaxed">
                "{currentQuote}"
              </p>
            </Card>
          </div>

          {/* 입력 영역 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              명언을 따라 입력하세요
            </h3>
            
            {/* 진행률 표시 */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-morning h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <Input
              value={userInput}
              onChange={handleInputChange}
              placeholder="여기에 명언을 입력하세요..."
              className="text-lg p-4 h-14 border-2 focus:border-primary"
            />
            
            {/* 실시간 피드백 */}
            <div className="text-sm">
              {userInput.length > 0 && (
                <p className={`${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {userInput.length} / {currentQuote.length} 글자
                  {isCompleted && " ✅ 완료!"}
                </p>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <Button
            onClick={handleSubmit}
            disabled={!isCompleted}
            className="w-full h-12 bg-gradient-morning hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {isCompleted ? "기상 인증하기 🌅" : "명언을 모두 입력해주세요"}
          </Button>

          {/* 랭킹 페이지로 이동 버튼 */}
          <Button
            variant="outline"
            onClick={() => navigate("/ranking")}
            className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300"
          >
            랭킹 보러가기 🏆
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;