class DashboardController < ApplicationController
  def index
    @dashboard_data = {
      daily_hours: [
        { date: "2024-01-01", hours: 8 },
        { date: "2024-01-02", hours: 6 },
        { date: "2024-01-03", hours: 7 },
        { date: "2024-01-04", hours: 9 },
        { date: "2024-01-05", hours: 5 },
        { date: "2024-01-06", hours: 8 },
        { date: "2024-01-07", hours: 7 }
      ],
      earnings_over_time: [
        { period: "Jan", amount: 3200 },
        { period: "Feb", amount: 3800 },
        { period: "Mar", amount: 4200 },
        { period: "Apr", amount: 3900 },
        { period: "May", amount: 4500 },
        { period: "Jun", amount: 4800 }
      ]
    }
  end

  def settings
    @users = User.all.order(:email_address)
  end
end
