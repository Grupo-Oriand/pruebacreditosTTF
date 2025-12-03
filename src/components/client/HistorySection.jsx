import React from 'react';
import { StatusBadge } from '../../pages/dealer/DealerDashboard';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const HistorySection = ({ requests, vehicles }) => {
  return (
    <div className="max-w-4xl">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>ID Solicitud</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay historial disponible
                </TableCell>
              </TableRow>
            ) : (
              requests.map(request => {
                const vehicle = vehicles.find(v => v.id === request.vehicleId);
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      {new Date(request.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono">#{request.id}</TableCell>
                    <TableCell className="font-medium">
                      {vehicle?.make} {vehicle?.model}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
