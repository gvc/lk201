defmodule TrackingWeb.TrackingChannel do
  use Phoenix.Channel

  def join("tracking:motion", _message, socket) do
    {:ok, socket}
  end

  def handle_in("visit_stats", params, socket) do
    IO.inspect(params)
    {:noreply, socket}
  end

  def handle_in("movement", %{"time" => t, "uid" => u, "x" => x, "y" => y}, socket) do
    Tracking.Tracker.track_movement(t, u, x, y)

    {:noreply, socket}
  end

  def handle_in("click", %{"time" => t, "uid" => u, "target" => target, "x" => x, "y" => y}, socket) do
    Tracking.Tracker.track_click(t, u, target, x, y)
    {:noreply, socket}
  end
end
