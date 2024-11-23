export interface IEscrow extends Document {
    clientId: string;
    freelancerId: string;
    projectId: string;
    amount: number;
    status: 'pending' | 'released' | 'disputed' | 'cancelled';
    createdAt: Date;
    releasedAt?: Date;
   
  }
  