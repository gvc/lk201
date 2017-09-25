# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :tracking,
  ecto_repos: [Tracking.Repo]

# Configures the endpoint
config :tracking, TrackingWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "575vFYFKNnNGjmZbEYkcGtw1H6tG4MsSp4L4gSc2ymWNmd1QZyASfRGgMQewCTNY",
  render_errors: [view: TrackingWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Tracking.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
