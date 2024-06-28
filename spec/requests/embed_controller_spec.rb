# frozen_string_literal: true

RSpec.describe EmbedController do
  describe "#comments" do
    let!(:embed_url) { "http://eviltrout.com/2013/02/10/why-discourse-uses-emberjs.html" }
    fab!(:embeddable_host)

    fab!(:topic)
    fab!(:topic_embed) { Fabricate(:topic_embed, embed_url: "http://eviltrout.com/2013/02/10/why-discourse-uses-emberjs.html") }
    fab!(:post) { Fabricate(:post, topic: topic_embed.topic) }

    before { Jobs.run_immediately! }

    it "hiding replies on embed" do
      get "/embed/comments", params: { embed_url: embed_url, show_comments: false }, headers: { "REFERER" => embed_url }

      html = Nokogiri::HTML5.fragment(response.body)
      posts_count = html.css("article.post").count

      expect(posts_count).to eq(0)
    end

    it "showing replies on embed" do
      get "/embed/comments", params: { embed_url: embed_url, show_comments: true }, headers: { "REFERER" => embed_url }

      html = Nokogiri::HTML5.fragment(response.body)
      posts_count = html.css("article.post").count
      expect(posts_count).to eq(1)
    end
  end
end
