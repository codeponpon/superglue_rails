module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      set_current_user || allow_anonymous_connection
    end

    private
      def set_current_user
        if session = Session.find_by(id: cookies.signed[:session_id])
          self.current_user = session.user
        end
      end

      def allow_anonymous_connection
        # Allow anonymous connections for public pages like project show
        self.current_user = nil
      end
  end
end
