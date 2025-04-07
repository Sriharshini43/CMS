import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function TeamRegistrationForm() {
  return (
    <div className="min-h-screen bg-black text-white px-20 py-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <div>
          <h1 className="text-2xl font-bold">CricketTMS</h1>
          <p className="text-gray-400 text-sm">Organize. Play. Win</p>
        </div>
      </div>

      {/* Subheader */}
      <div className="pb-4 mb-4">
        <h2 className="text-xl font-semibold">Team Registration</h2>
        <p className="text-sm text-gray-400">Fill in the details to register your team</p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center">
        <Card className="bg-black border border-gray-700 text-white w-full max-w-3xl rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Team information</h3>
              <p className="text-sm text-gray-400">
                Provide all the required information about your team
              </p>
            </div>

            {/* Team Name & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team name</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="team-name"
                    placeholder="Chennai Super Kings"
                    className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="home-venue">Home Venue</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="home-venue"
                    placeholder="M.A Chidambaram stadium"
                    className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Team Logo */}
            <div className="space-y-2">
              <Label htmlFor="team-logo">Team Logo</Label>
              <div className="relative h-20">
                <Input
                  id="team-logo"
                  type="file"
                  className="opacity-0 absolute inset-0 z-10 cursor-pointer"
                  accept="image/png, image/jpeg"
                />
                <div className="flex items-center justify-center h-full border border-gray-600 rounded-md bg-black text-sm text-gray-400 cursor-pointer">
                  Upload Logo
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Upload a square logo image (PNG, JPG) with a minimum size of 200x200px.
              </p>
            </div>

            {/* Owner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "owner-name", label: "Owner name", placeholder: "Kitbill" },
                { id: "owner-email", label: "Owner Email", placeholder: "Kitbill@gmail.com", type: "email" },
                { id: "owner-phone", label: "Owner Phone", placeholder: "+91 9876543210", type: "tel" },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                    <Input
                      id={field.id}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Team Motto */}
            <div className="space-y-2 pb-25">
              <Label htmlFor="team-motto">Team motto</Label>
              <div className="border border-gray-600 rounded-md px-4 py-2 bg-black">
                <Textarea
                  id="team-motto"
                  placeholder="Enter your team's motto or a brief description"
                  className="bg-transparent text-white placeholder-gray-400 border-none h-32 focus-visible:ring-0"
                />
              </div>
              <p className="text-xs text-gray-400">
                A short description or motto that represents your team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <Button variant="ghost" className="border border-gray-600 text-white">
                Cancel
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">
                Register Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
