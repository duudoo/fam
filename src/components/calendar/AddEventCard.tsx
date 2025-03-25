
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AddEventCard = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Add New Event</CardTitle>
        <CardDescription>Schedule a new activity or appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Create new events to keep track of important activities and appointments.
        </p>
        <div className="mt-4 space-y-2">
          <Badge className="mr-2 bg-famacle-coral text-white">High Priority</Badge>
          <Badge className="mr-2 bg-famacle-blue text-white">Medium Priority</Badge>
          <Badge className="mr-2 bg-famacle-slate-light">Low Priority</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add New Event</Button>
      </CardFooter>
    </Card>
  );
};

export default AddEventCard;
