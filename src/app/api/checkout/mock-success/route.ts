import { redirect } from 'next/navigation';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan');
    const type = searchParams.get('type');

    // In a real app, this would be handled by a Stripe webhook
    // For this replica, we'll just redirect back to the dashboard with a success message

    return redirect(`/dashboard?upgrade=success&plan=${plan}&type=${type}`);
}
