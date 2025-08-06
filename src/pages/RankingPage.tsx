import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    // 오늘의 인증 기록 확인
    const authData = localStorage.getItem('todayAuth');
    if (authData) {
      setCurrentUserAuth(JSON.parse(authData));
    }

    // 모의 랭킹 데이터 생성
    const mockRankings: RankingData[] = [
      { rank: 1, name: "김민수", time: "05:30" },
      { rank: 2, name: "이지영", time: "05:45" },
      { rank: 3, name: "박준호", time: "06:00" },
      { rank: 4, name: "최수진", time: "06:15" },
      { rank: 5, name: "정현우", time: "06:20" },
      { rank: 6, name: "강다은", time: "06:30" },
      { rank: 7, name: "윤서연", time: "06:45" },
      { rank: 8, name: "임재현", time: "07:00" },
      { rank: 9, name: "송미나", time: "07:15" },
      { rank: 10, name: "한동석", time: "07:30" }
    ];

    // 현재 사용자가 인증했다면 랭킹에 추가
    if (currentUserAuth) {
      const userTime = currentUserAuth.time.replace(':', '').split(' ')[1]
      let userRank = 1;
      
      // 사용자의 순위 계산
      for (let i = 0; i < mockRankings.length; i++) {
        const rankTime = mockRankings[i].time.replace(':', '');
        if (userTime > rankTime) {
          userRank = i + 2;
        } else {
          break;
        }
      }

      // 랭킹에 사용자 삽입
      const updatedRankings = [...mockRankings];
      updatedRankings.splice(userRank - 1, 0, {
        rank: userRank,
        name: "나",
        time: currentUserAuth.time,
        isCurrentUser: true
      });

      // 순위 재정렬
      updatedRankings.forEach((item, index) => {
        item.rank = index + 1;
      });

      setRankings(updatedRankings.slice(0, 15)); // 상위 15명만 표시
    } else {
      setRankings(mockRankings);
    }
  }, [currentUserAuth]);

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

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-soft border-0">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">🏆 일일 랭킹</h1>
            <p className="text-muted-foreground">{getCurrentDate()}</p>
            {currentUserAuth && (
              <Badge className="bg-gradient-morning text-white px-4 py-1">
                오늘 {currentUserAuth.time}에 인증 완료!
              </Badge>
            )}
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
                {user.isCurrentUser ? user.time.split(' ')[1] : user.time}
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
                    {user.isCurrentUser ? user.time.split(' ')[1] : user.time}
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