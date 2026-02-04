import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCave } from '../../hooks/useQueries';
import { Plus } from 'lucide-react';

export default function CreateCaveDialog() {
  const [open, setOpen] = useState(false);
  const [caveName, setCaveName] = useState('');
  const createCave = useCreateCave();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (caveName.trim()) {
      await createCave.mutateAsync(caveName.trim());
      setCaveName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Cave
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Cave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caveName">Cave Name</Label>
            <Input
              id="caveName"
              value={caveName}
              onChange={(e) => setCaveName(e.target.value)}
              placeholder="Enter cave name"
              required
              autoFocus
              className="border-purple-200 dark:border-purple-800 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!caveName.trim() || createCave.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {createCave.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
