module ApplicationHelper
  STYLES = {
    regular: 'r',
    solid: 's',
    brands: 'b',
    light: 'l',
    duotone: 'd'
  }.freeze

  def fa_icon(style, fontname)
    content_tag(:i, '', class: "fa#{STYLES[style]} fa-#{fontname}")
  end 
end
