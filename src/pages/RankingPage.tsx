import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ranking } from "@/lib/ranking";
import { supabase } from "@/lib/supabase";

interface RankingData {
  rank: number;
  name: string;
  time: string;
  isCurrentUser?: boolean;
}

const RankingPage = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [currentUserAuth, setCurrentUserAuth] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 사용자 확인
    const user = localStorage.getItem('user');
    if (!user) {
      // 로그인 페이지로 이동
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // 오늘의 인증 기록 확인
    const authData = localStorage.getItem('todayAuth');
    if (authData) {
      setCurrentUserAuth(JSON.parse(authData));
    }

    // 실시간 랭킹 데이터 가져오기
    const fetchRankings = async () => {
      try {
        const { data, error } = await ranking.getTodayRankings();
        if (error) {
          console.error('랭킹 데이터 가져오기 실패:', error);
          return;
        }

        if (data) {
          const formattedRankings: RankingData[] = data.map((record, index) => ({
            rank: index + 1,
            name: record.user_name,
            time: record.auth_time,
            isCurrentUser: record.user_id === JSON.parse(user).id
          }));
          setRankings(formattedRankings);
        }
      } catch (error) {
        console.error('랭킹 데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();

    // 실시간 구독 설정
    const subscription = supabase
      .channel('rankings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rankings' }, 
        () => {
          // 랭킹 변경 시 데이터 다시 가져오기
          fetchRankings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `${rank}`;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🏆</div>
          <div className="text-lg">랭킹을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-soft border-0">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">🏆 일일 랭킹</h1>
            <p className="text-muted-foreground">{getCurrentDate()}</p>
          </div>
        </Card>

        {/* 상위 3명 포디움 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {rankings.slice(0, 3).map((user, index) => (
            <Card
              key={user.rank}
              className={`p-4 text-center space-y-2 ${
                user.isCurrentUser ? 'bg-gradient-morning text-white shadow-glow' : 'bg-gradient-card'
              } ${index === 0 ? 'order-2 scale-110' : index === 1 ? 'order-1' : 'order-3'}`}
            >
              <div className={`text-4xl ${index === 0 ? 'text-6xl' : ''}`}>
                {getRankIcon(user.rank)}
              </div>
              <h3 className={`font-bold ${index === 0 ? 'text-xl' : ''} ${
                user.isCurrentUser ? 'text-white' : 'text-foreground'
              }`}>
                {user.name}
              </h3>
              <p className={`text-sm ${
                user.isCurrentUser ? 'text-white' : 'text-muted-foreground'
              }`}>
                {user.time}
              </p>
            </Card>
          ))}
        </div>

        {/* 전체 랭킹 리스트 */}
        <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-soft border-0">
          <h2 className="text-xl font-bold text-foreground mb-4">전체 순위</h2>
          <div className="space-y-3">
            {rankings.map((user) => (
              <div
                key={`${user.rank}-${user.name}`}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  user.isCurrentUser 
                    ? 'bg-gradient-morning text-white shadow-glow' 
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    user.rank <= 3 ? 'text-2xl' : 'text-lg'
                  } ${
                    user.isCurrentUser ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    {getRankIcon(user.rank)}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      user.isCurrentUser ? 'text-white' : 'text-foreground'
                    }`}>
                      {user.name}
                      {user.isCurrentUser && " (나)"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-lg ${
                    user.isCurrentUser ? 'text-white' : 'text-foreground'
                  }`}>
                    {user.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RankingPage;