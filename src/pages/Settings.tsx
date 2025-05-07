import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "../components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BlockchainService } from "@/services/blockchainService";

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: currentUser?.data?.fullName || "",
    email: currentUser?.data?.email || "",
    phone: currentUser?.data?.phoneNumber || "",
    address: currentUser?.data?.address || "",
    bloodGroup: currentUser?.data?.bloodGroup || "",
    gender: currentUser?.data?.gender || "",
    specialization: currentUser?.data?.specialization || "",
    license: currentUser?.data?.registrationNumber || "",
    hospitalAffiliation: currentUser?.data?.hospitalAffiliation || "",
    workAddress: currentUser?.data?.workAddress || "",
    yearsOfExperience: currentUser?.data?.yearsOfExperience || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blockchainService = new BlockchainService();
      
      if (currentUser?.type === 'doctor') {
        await blockchainService.updateDoctor({
          ...formData,
          walletAddress: currentUser.data.walletAddress,
          profileImage: profileImage || undefined
        });
      } else if (currentUser?.type === 'patient') {
        await blockchainService.updatePatient({
          ...formData,
          walletAddress: currentUser.data.walletAddress,
          profileImage: profileImage || undefined
        });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role={currentUser?.type || "patient"}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-lg border">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser?.data?.profileImage} />
                      <AvatarFallback>
                        {currentUser?.data?.fullName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profileImage" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Upload size={16} />
                          Upload new photo
                        </div>
                      </Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {currentUser?.type === 'patient' && (
                      <>
                        <div>
                          <Label htmlFor="bloodGroup">Blood Group</Label>
                          <Input
                            id="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Input
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {currentUser?.type === 'doctor' && (
                      <>
                        <div>
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input
                            id="specialization"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="license">License/Registration Number</Label>
                          <Input
                            id="license"
                            value={formData.license}
                            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hospitalAffiliation">Hospital Affiliation</Label>
                          <Input
                            id="hospitalAffiliation"
                            value={formData.hospitalAffiliation}
                            onChange={(e) => setFormData({ ...formData, hospitalAffiliation: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                          <Input
                            id="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="workAddress">Work Address</Label>
                          <Input
                            id="workAddress"
                            value={formData.workAddress}
                            onChange={(e) => setFormData({ ...formData, workAddress: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
