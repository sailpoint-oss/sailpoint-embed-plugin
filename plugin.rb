# frozen_string_literal: true

# name: sailpoint-embed
# about: Embedding settings to hide/show the replies in the embed
# meta_topic_id: TODO
# version: 0.0.1
# authors: Darrell Thobe
# url: TODO

enabled_site_setting :sailpoint_embed_enabled

module ::SailPointEmbed
  PLUGIN_NAME = "sailpoint-embed"
end

require_relative "lib/discourse-embed/embed_controller_extension"

after_initialize do
  reloadable_patch do
    ::ActionController::Base.prepend_view_path File.expand_path("../app/views/", __FILE__)
    EmbedController.prepend SailPointEmbed::EmbedControllerExtension
  end
end
