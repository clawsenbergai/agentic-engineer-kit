import { NextResponse } from "next/server";

export function ok(data, init = {}) {
  return NextResponse.json(data, {
    status: 200,
    ...init,
  });
}

export function created(data) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(error, details) {
  return NextResponse.json(
    {
      ok: false,
      error,
      details,
    },
    { status: 400 }
  );
}

export function unauthorized() {
  return NextResponse.json(
    {
      ok: false,
      error: "Unauthorized",
    },
    { status: 401 }
  );
}

export function serverError(error, details) {
  return NextResponse.json(
    {
      ok: false,
      error,
      details,
    },
    { status: 500 }
  );
}
