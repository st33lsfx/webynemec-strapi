import type { Schema, Struct } from '@strapi/strapi';

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Odkaz na soci\u00E1ln\u00ED s\u00ED\u0165';
    displayName: 'Soci\u00E1ln\u00ED odkaz';
    icon: 'share';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'IG'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'Odkaz s popiskem a URL';
    displayName: 'Odkaz';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.social-link': FooterSocialLink;
      'shared.link': SharedLink;
    }
  }
}
