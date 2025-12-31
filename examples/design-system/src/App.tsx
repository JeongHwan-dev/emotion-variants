import type { ComponentProps, PropsWithChildren } from 'react';
import { Button } from '@/components';
import { theme } from '@/theme';

export function App() {
  return (
    <div
      css={{
        padding: theme.spacing[10],
      }}
    >
      <div
        css={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: theme.spacing[16],
          background: theme.color.primitive.white,
          borderRadius: theme.radius.lg,
          boxShadow: `0 ${theme.spacing[2]} ${theme.spacing[8]} rgba(0, 0, 0, 0.4)`,
        }}
      >
        <h1
          css={{
            marginBottom: theme.spacing[8],
            fontSize: theme.fontSize['6xl'],
            fontWeight: theme.fontWeight.bold,
            color: theme.color.semantic.foreground.neutral,
            textAlign: 'center',
          }}
        >
          Button Component Examples
        </h1>

        <Section title="Default">
          <Button>Button</Button>
        </Section>

        <Section title="Colors">
          <SectionContent>
            <Button color="primary">Primary</Button>
            <Button color="danger">Danger</Button>
            <Button color="warning">Warning</Button>
            <Button color="dark">Dark</Button>
          </SectionContent>
        </Section>

        <Section title="Variants">
          <SectionContent>
            <Button variant="fill">Fill</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
          </SectionContent>
        </Section>

        <Section title="Fill Variant">
          <SectionContent>
            <Button variant="fill" color="primary">
              Primary
            </Button>
            <Button variant="fill" color="danger">
              Danger
            </Button>
            <Button variant="fill" color="warning">
              Warning
            </Button>
            <Button variant="fill" color="dark">
              Dark
            </Button>
          </SectionContent>
        </Section>

        <Section title="Outline Variant">
          <SectionContent>
            <Button variant="outline" color="primary">
              Primary
            </Button>
            <Button variant="outline" color="danger">
              Danger
            </Button>
            <Button variant="outline" color="warning">
              Warning
            </Button>
            <Button variant="outline" color="dark">
              Dark
            </Button>
          </SectionContent>
        </Section>

        <Section title="Text Variant">
          <SectionContent>
            <Button variant="text" color="primary">
              Primary
            </Button>
            <Button variant="text" color="danger">
              Danger
            </Button>
            <Button variant="text" color="warning">
              Warning
            </Button>
            <Button variant="text" color="dark">
              Dark
            </Button>
          </SectionContent>
        </Section>

        <Section title="Display">
          <SectionContent
            css={{
              flexDirection: 'column',
            }}
          >
            <div>
              <Button display="inline">Inline</Button>
            </div>
            <div>
              <Button display="block">Block</Button>
            </div>
            <div>
              <Button display="full">Full Width</Button>
            </div>
          </SectionContent>
        </Section>

        <Section title="Sizes">
          <SectionContent>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
            <Button size="xlarge">XLarge</Button>
          </SectionContent>
        </Section>

        <Section title="States">
          <SectionContent>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </SectionContent>
        </Section>
      </div>
    </div>
  );
}

function SectionContent({ children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing[6],
        flexWrap: 'wrap',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section
      css={{
        marginBottom: theme.spacing[16],
      }}
    >
      <h2
        css={{
          marginBottom: theme.spacing[8],
          fontSize: theme.fontSize['2xl'],
          fontWeight: theme.fontWeight.bold,
          color: theme.color.semantic.foreground.neutral,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
