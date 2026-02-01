import { NextResponse } from "next/server";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required." }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenWeather API key is not configured." },
      { status: 500 }
    );
  }

  const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&units=imperial&appid=${apiKey}`;
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
