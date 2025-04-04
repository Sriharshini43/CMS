"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut } from "lucide-react";

export default function CricketDashboard() {
  const teams = [
    { name: "Team1", matches: 0, wins: 0, losses: 0, nrr: "0.00", points: 0 },
    { name: "Team2", matches: 0, wins: 0, losses: 0, nrr: "0.00", points: 0 },
    { name: "Team3", matches: 0, wins: 0, losses: 0, nrr: "0.00", points: 0 },
    { name: "Team4", matches: 0, wins: 0, losses: 0, nrr: "0.00", points: 0 },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-20 py-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <div>
          <h1 className="text-2xl font-bold">CricketTMS</h1>
          <p className="text-gray-400 text-sm">Organize. Play. Win</p>
        </div>
        <Button className="px-3 py-1 rounded-md hover:bg-gray-400 bg-white text-black flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </Button>
      </div>

      {/* Dashboard Section */}
      <section className="mt-16 mb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-gray-400 text-sm">Manage your cricket tournament</p>
          </div>
          <Button className="flex items-center gap-2 px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-300">
            <span className="w-6 h-6 flex items-center justify-center border border-black rounded-full text-black font-bold text-xl leading-none">
              +
            </span>
            <span className="text-sm">Join In Team</span>
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Team", count: 0, text: "Join in team to see no. of players" },
            { title: "Total Players", count: 0, text: "Join in team to see no. of players" },
            { title: "Total Players", count: 0, text: "Join in team to see no. of players" },
            { title: "Total Players", count: 0, text: "Join in team to see no. of players" },
          ].map((card, index) => (
            <Card key={index} className="bg-black border border-gray-700 text-white w-full h-40 p-8">
              <CardContent className="flex flex-col items-center justify-center text-center h-full">
                <h3 className="text-md font-semibold mb-1">{card.title}</h3>
                <p className="text-4xl font-bold mb-1">{card.count}</p>
                <p className="text-sm text-gray-400">{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold">Upcoming Matches</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[ 
            { date: "2025-03-30", time: "16:00", stadium: "M. Chinnaswamy Stadium" },
            { date: "2025-04-04", time: "15:00", stadium: "Arun Jaitley Stadium" }
          ].map((match, index) => (
            <Card key={index} className="p-6 text-center border-2 border-gray-700 bg-black text-white">
              <CardHeader className="flex justify-between items-center">
                <p className="text-lg font-medium">{match.date} • {match.time}</p>
                <span className="bg-gray-700 text-xs px-2 py-1 rounded">Group stage</span>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center my-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center rounded-full">T1</div>
                    <span className="mt-1 text-sm text-white">Team1</span>
                  </div>
                  <span className="text-lg font-semibold">Vs</span>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center rounded-full">T2</div>
                    <span className="mt-1 text-sm">Team2</span>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">{match.stadium}</p>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex justify-center">
                  <Button variant="outline" className="bg-black border-2 border-gray-500 text-white rounded-md px-10 py-2">More Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Points Table */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Points Table</h2>
        <div className="overflow-x-auto">
          <Table className="border border-gray-700 min-w-[900px]">
            <TableHeader>
              <TableRow className="border-b border-gray-700 bg-white text-black">
                <TableHead className="text-left p-2">#</TableHead>
                <TableHead className="text-left p-2">Team</TableHead>
                <TableHead className="text-center p-2">M</TableHead>
                <TableHead className="text-center p-2">W</TableHead>
                <TableHead className="text-center p-2">L</TableHead>
                <TableHead className="text-center p-2">NR</TableHead>
                <TableHead className="text-center p-2">Pts</TableHead>
                <TableHead className="text-center p-2">NRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, index) => (
                <TableRow key={index} className="border-b border-gray-700 text-center">
                  <TableCell className="p-2">{index + 1}</TableCell>
                  <TableCell className="p-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-full">
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      {team.name}
                    </div>
                  </TableCell>
                  <TableCell className="p-2">{team.matches}</TableCell>
                  <TableCell className="p-2">{team.wins}</TableCell>
                  <TableCell className="p-2">{team.losses}</TableCell>
                  <TableCell className="p-2">0</TableCell>
                  <TableCell className="p-2">{team.points}</TableCell>
                  <TableCell className="p-2">{team.nrr}</TableCell>
                </TableRow>
              ))}
              {/* Button row */}
              <TableRow>
              <TableCell colSpan={8} className="text-center pt-4 border-t border-gray-700">
                  <Button className="bg-white border-2 border-gray-500 text-black rounded-md px-6 py-2 hover:bg-white hover:text-black hover:border-gray-700">
                    View complete table
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
