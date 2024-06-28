# frozen_string_literal: true
module SailPointEmbed
  module EmbedControllerExtension
    extend ActiveSupport::Concern

    prepended do
      before_action :set_show_comments, only: [:comments]

      def set_show_comments
        @show_comments = ActiveModel::Type::Boolean.new.cast(params[:show_comments])
      end
    end
  end
end
