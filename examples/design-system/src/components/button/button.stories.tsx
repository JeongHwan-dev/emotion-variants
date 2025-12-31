/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['fill', 'outline', 'text'],
      description: 'Button style variant',
    },
    display: {
      control: 'select',
      options: ['inline', 'block', 'full'],
      description: 'Button display mode',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
      description: 'Button size',
    },
    color: {
      control: 'select',
      options: ['primary', 'danger', 'warning', 'dark'],
      description: 'Button color variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Colors: Story = {
  render: (args) => (
    <Layout>
      <Button color="primary" {...args}>
        Primary
      </Button>
      <Button color="danger" {...args}>
        Danger
      </Button>
      <Button color="warning" {...args}>
        Warning
      </Button>
      <Button color="dark" {...args}>
        Dark
      </Button>
    </Layout>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <Layout>
      <Button variant="fill" {...args}>
        Fill
      </Button>
      <Button variant="outline" {...args}>
        Outline
      </Button>
      <Button variant="text" {...args}>
        Text
      </Button>
    </Layout>
  ),
};

export const FillVariant: Story = {
  render: (args) => (
    <Layout>
      <Button variant="fill" color="primary" {...args}>
        Primary
      </Button>
      <Button variant="fill" color="danger" {...args}>
        Danger
      </Button>
      <Button variant="fill" color="warning" {...args}>
        Warning
      </Button>
      <Button variant="fill" color="dark" {...args}>
        Dark
      </Button>
    </Layout>
  ),
};

export const OutlineVariant: Story = {
  render: (args) => (
    <Layout>
      <Button variant="outline" color="primary" {...args}>
        Primary
      </Button>
      <Button variant="outline" color="danger" {...args}>
        Danger
      </Button>
      <Button variant="outline" color="warning" {...args}>
        Warning
      </Button>
      <Button variant="outline" color="dark" {...args}>
        Dark
      </Button>
    </Layout>
  ),
};

export const TextVariant: Story = {
  render: (args) => (
    <Layout>
      <Button variant="text" color="primary" {...args}>
        Primary
      </Button>
      <Button variant="text" color="danger" {...args}>
        Danger
      </Button>
      <Button variant="text" color="warning" {...args}>
        Warning
      </Button>
      <Button variant="text" color="dark" {...args}>
        Dark
      </Button>
    </Layout>
  ),
};

export const Display: Story = {
  render: (args) => (
    <Layout
      css={{
        flexDirection: 'column',
      }}
    >
      <div>
        <Button display="inline" {...args}>
          Inline
        </Button>
      </div>
      <div>
        <Button display="block" {...args}>
          Block
        </Button>
      </div>
      <div>
        <Button display="full" {...args}>
          Full Width
        </Button>
      </div>
    </Layout>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Layout>
      <Button size="small" {...args}>
        Small
      </Button>
      <Button size="medium" {...args}>
        Medium
      </Button>
      <Button size="large" {...args}>
        Large
      </Button>
      <Button size="xlarge" {...args}>
        XLarge
      </Button>
    </Layout>
  ),
};

export const States: Story = {
  render: (args) => (
    <Layout>
      <Button {...args}>Normal</Button>
      <Button disabled {...args}>
        Disabled
      </Button>
    </Layout>
  ),
};

function Layout({ children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      css={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
