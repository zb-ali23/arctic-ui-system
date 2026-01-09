import { corsHeaders } from './cors.ts';

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
): Response {
  const body: Record<string, unknown> = { error: message };
  if (details) body.details = details;
  
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function notFoundResponse(resource = 'Resource'): Response {
  return errorResponse(`${resource} not found`, 404);
}

export function validationErrorResponse(errors: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ error: 'Validation failed', errors }),
    { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export function serverErrorResponse(error: Error): Response {
  console.error('Server error:', error);
  return errorResponse('Internal server error', 500);
}
