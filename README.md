# Next.js App with shadcn/ui and Tailwind CSS

This is a [Next.js](https://nextjs.org) project bootstrapped with shadcn/ui and Tailwind CSS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding shadcn/ui Components

To add shadcn/ui components to your project, use the CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

For example, to add a button component:

```bash
npx shadcn-ui@latest add button
```

Then import it in your code:

```tsx
import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button>Click me</Button>
}
```

## Available Components

Visit [shadcn/ui](https://ui.shadcn.com/) to see all available components.

## Configuration

- **Tailwind**: Configured in `tailwind.config.ts`
- **shadcn/ui**: Configured in `components.json`
- **TypeScript**: Configured in `tsconfig.json`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


