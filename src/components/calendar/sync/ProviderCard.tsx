
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

type ProviderStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

interface ProviderCardProps {
  title: string;
  description: string;
  provider: 'google' | 'outlook';
  status: ProviderStatus;
  lastSynced?: Date;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
  icon: React.ReactNode;
}

const ProviderCard = ({
  title,
  description,
  provider,
  status,
  lastSynced,
  onConnect,
  onSync,
  onDisconnect,
  icon
}: ProviderCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {status !== 'disconnected' && (
            <Badge variant={status === 'error' ? 'destructive' : 'outline'} className="ml-2">
              {status === 'connected' && <Check className="h-3 w-3 mr-1" />}
              {status === 'syncing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {status}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'disconnected' ? (
          <Button onClick={onConnect} className="bg-famacle-blue hover:bg-famacle-blue-dark">
            Connect {title}
          </Button>
        ) : (
          <div className="space-y-4">
            {lastSynced && (
              <p className="text-sm text-famacle-slate-light">
                Last synced: {lastSynced.toLocaleString()}
              </p>
            )}
            <div className="flex gap-2">
              <Button 
                onClick={onSync} 
                disabled={status === 'syncing'}
                className="bg-famacle-blue hover:bg-famacle-blue-dark"
              >
                {status === 'syncing' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sync Now
              </Button>
              <Button 
                onClick={onDisconnect} 
                variant="outline" 
                disabled={status === 'syncing'}
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
