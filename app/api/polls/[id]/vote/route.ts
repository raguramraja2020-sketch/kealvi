export async function GET() {
  return Response.json([
    {
      id: 1,
      question: "Test Poll"
    }
  ]);
}