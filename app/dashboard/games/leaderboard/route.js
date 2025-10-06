// app/api/games/leaderboard/route.js
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('stats.gamePoints', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      leaderboard.push({
        name: userData.name,
        score: userData.stats?.gamePoints || 0,
        games: userData.stats?.gamesPlayed || 0
      });
    });
    
    return Response.json({ leaderboard });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}