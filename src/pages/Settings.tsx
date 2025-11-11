import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ImageCropper } from '@/components/ImageCropper';
import { useToast } from '@/components/ui/use-toast';
import { API_URL } from '@/lib/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatar, setAvatar] = useState(user?.profilePicture ?? '');
  const [openCrop, setOpenCrop] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [prefEmail, setPrefEmail] = useState(true);
  const [prefPush, setPrefPush] = useState(true);

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setOpenCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    updateUser({ name, email, bio, profilePicture: avatar });
    toast({ title: 'Profile updated' });
  };

  const changePassword = () => {
    if (!password || password !== password2) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password changed' });
    setPassword('');
    setPassword2('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-8 space-y-8">
        <h1 className="text-4xl font-serif font-bold">Settings</h1>

        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <img src={avatar} alt="avatar" className="h-24 w-24 rounded-full object-cover border" />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => fileRef.current?.click()}>Change</Button>
                <Button variant="ghost" onClick={() => setAvatar('')}>Remove</Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onSelectImage} />
              </div>
            </div>
            <div className="grid gap-4 flex-1">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={saveProfile}>Save Profile</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pwd1">New password</Label>
              <Input id="pwd1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pwd2">Confirm password</Label>
              <Input id="pwd2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={changePassword}>Update Password</Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Email notifications</div>
              <div className="text-sm text-muted-foreground">Get updates by email</div>
            </div>
            <Switch checked={prefEmail} onCheckedChange={setPrefEmail} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Push notifications</div>
              <div className="text-sm text-muted-foreground">Realtime alerts on activity</div>
            </div>
            <Switch checked={prefPush} onCheckedChange={setPrefPush} />
          </div>
        </Card>
      </div>

      <Dialog open={openCrop} onOpenChange={setOpenCrop}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          {tempImage && (
            <ImageCropper
              imageSrc={tempImage}
              aspect={1}
              onCancel={() => setOpenCrop(false)}
              onCropped={(url) => {
                // try upload to backend
                fetch(url)
                  .then(r => r.blob())
                  .then(async (blob) => {
                    const form = new FormData();
                    form.append('image', blob, 'avatar.png');
                    const res = await fetch(`${API_URL}/api/uploads`, { method: 'POST', body: form, credentials: 'include' });
                    if (res.ok) {
                      const data = await res.json();
                      setAvatar(data.url.startsWith('http') ? data.url : `${API_URL}${data.url}`);
                    } else {
                      setAvatar(url);
                    }
                  })
                  .catch(() => setAvatar(url));
                setOpenCrop(false);
                setTempImage(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;


