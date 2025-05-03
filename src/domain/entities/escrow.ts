export interface Escrow  {
    clientId: string;
    freelancerId: string;
    projectId: any;
    amount: number;
    status: 'pending' | 'released' | 'disputed' | 'cancelled';
    createdAt: Date;
    releasedAt?: Date;
}