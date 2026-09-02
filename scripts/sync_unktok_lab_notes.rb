#!/usr/bin/env ruby

require "cgi"
require "net/http"
require "uri"
require "yaml"

SOURCE_URL = ENV.fetch(
  "UNKTOK_LAB_NOTES_URL",
  "https://raw.githubusercontent.com/unktok/webpage/main/blog/index.html"
)
OUTPUT_PATH = File.expand_path(
  ENV.fetch("UNKTOK_LAB_NOTES_OUTPUT", "_data/unktok_lab_notes.yml"),
  Dir.pwd
)

def fetch_page(url, redirects_left = 3)
  raise "too many redirects" if redirects_left.zero?

  uri = URI.parse(url)
  response = Net::HTTP.start(
    uri.host,
    uri.port,
    use_ssl: uri.scheme == "https",
    open_timeout: 10,
    read_timeout: 20
  ) do |http|
    http.request(Net::HTTP::Get.new(uri.request_uri))
  end

  case response
  when Net::HTTPSuccess
    response.body
  when Net::HTTPRedirection
    fetch_page(URI.join(url, response["location"]).to_s, redirects_left - 1)
  else
    raise "HTTP #{response.code} from #{url}"
  end
end

def clean_text(fragment)
  text = fragment.to_s.gsub(/<[^>]+>/, " ").gsub(/\s+/, " ").strip
  text = text.dup.force_encoding("UTF-8")
  text = text.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
  text = CGI.unescapeHTML(text)
  {
    "&mdash;" => "—",
    "&ndash;" => "–",
    "&rsquo;" => "’",
    "&lsquo;" => "‘",
    "&rdquo;" => "”",
    "&ldquo;" => "“",
    "&hellip;" => "…",
    "&middot;" => "·",
    "&nbsp;" => " "
  }.each { |entity, replacement| text = text.gsub(entity, replacement) }
  text
end

def attr_value(fragment, name)
  fragment[/#{Regexp.escape(name)}=["']([^"']+)["']/, 1]
end

def parse_notes(html)
  html.scan(/<li\b[^>]*>(.*?)<\/li>/mi).each_with_object([]) do |match, notes|
    item = match.first
    href = attr_value(item[/<a\b[^>]*>/i].to_s, "href")
    next if href.to_s.empty?

    parsed_href = URI.parse(href)
    next if parsed_href.scheme || parsed_href.host

    date = clean_text(item[/<span\b[^>]*class=["'][^"']*post-date[^"']*["'][^>]*>(.*?)<\/span>/mi, 1])
    title = clean_text(item[/<span\b[^>]*class=["'][^"']*post-title[^"']*["'][^>]*>(.*?)<\/span>/mi, 1])
    description = clean_text(item[/<p\b[^>]*class=["'][^"']*post-desc[^"']*["'][^>]*>(.*?)<\/p>/mi, 1])
    next if date.empty? || title.empty?

    notes << {
      "date" => date,
      "title" => title,
      "description" => description,
      "url" => URI.join("https://unktok.com/blog/", href).to_s,
      "source" => "Unktok Lab Notes"
    }
  end.sort_by { |note| note["date"] }.reverse
end

begin
  notes = parse_notes(fetch_page(SOURCE_URL))
  raise "no Lab Notes found; refusing to replace the last good snapshot" if notes.empty?

  temporary_path = "#{OUTPUT_PATH}.tmp.#{$$}"
  begin
    File.write(temporary_path, YAML.dump(notes))
    File.rename(temporary_path, OUTPUT_PATH)
  ensure
    File.delete(temporary_path) if File.exist?(temporary_path)
  end
  puts "Synced #{notes.length} Unktok Lab Notes to #{OUTPUT_PATH}"
rescue StandardError => e
  warn "Unktok Lab Notes sync skipped: #{e.message}"
  exit(File.exist?(OUTPUT_PATH) ? 0 : 1)
end
