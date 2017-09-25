defmodule Tracking.Tracker do
  use GenServer

  def start_link() do
    GenServer.start_link(__MODULE__, :ok, [name: __MODULE__])
  end

  def track_movement(time, uid, x, y) do
    GenServer.cast(__MODULE__, {:append, time, uid, x, y})
  end

  def track_click(time, uid, target, x, y) do
    GenServer.cast(__MODULE__, {:append, time, uid, target, x, y})
  end

  def init(:ok) do
    {:ok, file_pid} = File.open('tracking.txt', [:append])
    {:ok, %{recorder: file_pid}}
  end

  def handle_cast({:append, t, u, x, y}, %{recorder: file_pid} = state) do
    IO.write(file_pid, "move,#{t},#{u},#{x},#{y}\n")
    {:noreply, state}
  end

  def handle_cast({:append, t, u, target, x, y}, %{recorder: file_pid} = state) do
    IO.write(file_pid, "click,#{t},#{u},#{target},#{x},#{y}\n")
    {:noreply, state}
  end
end
