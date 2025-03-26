
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Parent, CoParentInvite } from "@/utils/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CoParentsListProps {
  currentUser: Parent;
  invites: CoParentInvite[];
}

const CoParentsList = ({ currentUser, invites }: CoParentsListProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Primary Account (You)</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-famacle-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              {currentUser.phone && (
                <p className="text-sm text-muted-foreground">{currentUser.phone}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {invites.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Co-Parents</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      invite.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      invite.status === "accepted" ? "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(invite.invitedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CoParentsList;
