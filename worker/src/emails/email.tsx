import React from 'react';
import juice from 'juice';
import { renderAsync } from '@react-email/render';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

export interface EmailUser {
  email: string;
  displayName: string;
  id: string;
}

export interface EmailTemplateBaseProps {
  user: EmailUser;
  unsubscribeUrl: string;
}

export interface EmailTemplateStaticProps {
  metaUrl: string;
  subject: (props: EmailTemplateBaseProps) => string;
}

export type EmailTemplateComponent<TProps extends EmailTemplateBaseProps> = React.FC<TProps> &
  EmailTemplateStaticProps;

export interface RenderTemplateResult {
  html: string;
  subject: string;
}

export async function renderTemplate<TProps extends EmailTemplateBaseProps>(
  Template: EmailTemplateComponent<TProps>,
  props: TProps,
): Promise<RenderTemplateResult> {
  let html;
  try {
    // eslint-disable-next-line react/jsx-props-no-spreading
    html = await renderAsync(<Template {...props} />);
  } catch (error) {
    throw new Error(`Rendering failed: ${error}`);
  }

  const filename = fileURLToPath(Template.metaUrl);
  const dirname = path.dirname(filename);

  const juiceHtml = juice(html, {
    webResources: {
      relativeTo: dirname,
    },
  });

  const subject = Template.subject(props);

  return { html: juiceHtml, subject };
}
