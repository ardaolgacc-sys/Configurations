# Planning Guide

A comprehensive advertising optimization platform featuring onboarding journey, scope selection, configuration management, dayparting analytics, campaign creation automation, and AI-powered decision monitoring for e-commerce campaigns.

**Experience Qualities**: 
1. **Professional** - Conveys expertise and trustworthiness with precise typography, clear information hierarchy, and step-by-step guidance suitable for business decisions
2. **Efficient** - Streamlines complex configuration tasks through intelligent onboarding, tabbed navigation, collapsible sections, and minimal cognitive load
3. **Transparent** - Provides complete visibility into AI-driven decisions and configuration scope with detailed indicators and actionable insights

**Complexity Level**: Light Application (multiple features with basic state)
A multi-step onboarding flow followed by a multi-tab configuration and monitoring interface with interactive form controls, data tables, visualizations, and navigation organized across four main sections: Store Settings, Dayparting, Campaign Creation, and AI Decisions.

## Essential Features

### Onboarding Journey
- **Functionality**: Two-step modal onboarding process for initial configuration
- **Purpose**: Guides new users through critical decisions before accessing the main application
- **Trigger**: Automatically displays on first visit or when user clicks "Edit Configuration"
- **Progression**: Welcome → Step 1 (Management Selection) → Step 2 (Scope Selection) → Complete → Main App
- **Success criteria**: User completes both steps, selections persist, main app reflects chosen configuration

#### Management Type Selection (Step 1)
- **Functionality**: Choice between Eva AI automated management or manual configuration
- **Purpose**: Sets the default optimization approach for all campaign aspects
- **Trigger**: User arrives at onboarding
- **Progression**: User views two cards → Selects management type → Continues to scope selection
- **Success criteria**: Selected card shows visual emphasis, Eva AI option shows as recommended with benefits listed

#### Campaign Scope Selection (Step 2)
- **Functionality**: Multi-select interface for choosing which campaign types to apply configurations to
- **Purpose**: Allows users to target specific campaign categories (Sponsored Products variations, Sponsored Brands, Sponsored Display)
- **Trigger**: User completes Step 1 and clicks Continue
- **Progression**: User views 5 scope options → Selects one or more (or all) → Sees count indicator → Completes onboarding
- **Success criteria**: Selected scopes show checkmarks and visual emphasis, "Select All" toggle works, continue button shows selected count

### Tab Navigation System
- **Functionality**: Four-tab navigation between Store Settings, Dayparting, Campaign Creation, and AI Decisions
- **Purpose**: Organizes the application into logical sections while maintaining context and state
- **Trigger**: User clicks on any tab label
- **Progression**: User views tabs → Clicks desired tab → Active indicator moves → New content loads → Previous tab state preserved
- **Success criteria**: Active tab shows purple underline, smooth transitions, content updates without page reload

### Header Configuration Indicators
- **Functionality**: Badges displaying management type and active scope count, plus theme toggle button
- **Purpose**: Provides persistent visibility into current configuration and allows theme switching
- **Trigger**: Displays automatically after onboarding completion; theme toggle responds to clicks
- **Progression**: Always visible → Shows Eva AI badge if applicable → Shows scope count → Edit button allows reconfiguration → Theme toggle switches between light/dark
- **Success criteria**: Badges update based on configuration, Edit button reopens onboarding, theme toggle changes theme instantly

### Store Settings Configuration (Tab 1)

#### Step-by-Step Journey
- **Functionality**: Progressive disclosure of configuration steps with clear headings and descriptions
- **Purpose**: Guides users through complex setup in an understandable sequence
- **Trigger**: User navigates to Store Settings tab
- **Progression**: Introduction text → Step 1 (Focus) → Step 2 (Target Metric) → Step 3 (Bid Boundaries) → Step 4 (Optimizations) → Save
- **Success criteria**: Each step is clearly labeled, descriptive text explains purpose, user can complete setup confidently

#### Focus Strategy Selection
- **Functionality**: Radio button group allowing selection between 5 growth/profit optimization strategies
- **Purpose**: Sets the primary business objective that influences all other optimization decisions
- **Trigger**: User clicks on any strategy option
- **Progression**: User views list → Clicks strategy → Visual highlight appears → Selection state persists
- **Success criteria**: Selected strategy shows distinct visual emphasis with background highlight and bold text

#### Target Type Configuration
- **Functionality**: Toggle between ACoS and TACoS metrics with contextual breakeven information
- **Purpose**: Defines the key performance indicator for advertising spend optimization
- **Trigger**: User selects ACoS or TACoS radio option
- **Progression**: User views options → Selects metric → Related calculations update → Breakeven reference displays
- **Success criteria**: Selected metric is visually indicated and breakeven ACoS link remains accessible

#### Bid Range Settings
- **Functionality**: Text inputs for minimum and maximum bid amounts with recommended value hints
- **Purpose**: Establishes safe bidding boundaries to prevent overspend or underperformance
- **Trigger**: User clicks into input field
- **Progression**: User focuses field → Enters value → Sees recommendation → Optionally clicks to apply recommendation
- **Success criteria**: Values are editable, recommendations are clickable and update the input

#### Target ACoS Input
- **Functionality**: Percentage input field with recommended target suggestion
- **Purpose**: Sets the goal advertising cost of sale percentage
- **Trigger**: User clicks input field
- **Progression**: User focuses field → Enters percentage → Views recommendation → Can apply suggested value
- **Success criteria**: Input accepts percentage values and displays with proper formatting

#### Collapsible Optimization Sections
- **Functionality**: Three collapsible sections (Daily Bidding, Negation, Inventory & Performance Guard) with optimization controls and priority management
- **Purpose**: Configures automated optimization behaviors while reducing visual clutter, ordered by typical importance
- **Trigger**: User clicks section header to expand/collapse or clicks "Add Optimization" button
- **Progression**: User clicks header → Section expands → Table of optimizations shown → User can add/remove/reorder → Section can collapse
- **Success criteria**: Smooth accordion-style expansion, caret icon rotates to indicate state, optimizations display with priority controls, selections persist when collapsed

#### Eva AI Integration in Step 4
- **Functionality**: Visual indicator and modified messaging when Eva AI management is active
- **Purpose**: Reminds users that AI is handling optimizations while allowing overrides
- **Trigger**: Displays when management type is set to Eva AI
- **Progression**: Badge shows "Eva AI Active" → Description explains override capability → User can still add custom rules
- **Success criteria**: Eva AI badge visible, messaging clarifies that custom rules can override AI decisions

### Dayparting Analytics (Tab 2)
- **Functionality**: Heat map visualization showing campaign performance by day and hour
- **Purpose**: Helps users identify optimal bidding times across the week
- **Trigger**: User navigates to Dayparting tab
- **Progression**: User views heatmap → Selects metric filter → Analyzes patterns → Can create dayparting rules
- **Success criteria**: 24x7 grid displays with color intensity showing performance, metric filters work, "Create Rule" button accessible

#### Metric Selection
- **Functionality**: Button group for filtering heatmap by different metrics (Impressions, Clicks, Sales, Cost, CTR, CVR, ACoS)
- **Purpose**: Allows analysis of different performance dimensions
- **Trigger**: User clicks metric button
- **Progression**: User selects metric → Heatmap updates → Color intensity reflects selected metric values
- **Success criteria**: Active metric button shows primary styling, heatmap transitions smoothly

### Campaign Creation (Tab 3)
- **Functionality**: Dedicated interface for managing campaign creation automation rules
- **Purpose**: Centralizes all campaign launching logic separate from other optimizations
- **Trigger**: User navigates to Campaign Creation tab
- **Progression**: User views creation rules → Adds new rules via dropdown → Configures conditions → Rules display in table
- **Success criteria**: Clear table of creation rules, add optimization dropdown works, rules can be prioritized and deleted

#### Creation Rule Management
- **Functionality**: Table with priority controls similar to other optimization sections
- **Purpose**: Allows users to define when new campaigns should be automatically created
- **Trigger**: User clicks "Add Optimization" and selects option
- **Progression**: User adds rule → Table updates → Rules show with priority numbers → User can reorder via arrows
- **Success criteria**: Same UX pattern as Store Settings optimizations for consistency

### AI Decisions Monitoring (Tab 4)

#### Decision Table Display
- **Functionality**: Comprehensive data table showing all AI-powered bid decisions, status changes, and negations
- **Purpose**: Provides complete transparency into automated actions for audit and learning
- **Trigger**: User clicks AI Decisions tab
- **Progression**: User navigates → Table loads → User can search, filter, paginate → User can view details or revert decisions
- **Success criteria**: Table displays 7+ sample decisions with all relevant columns, responsive horizontal scroll

#### Search and Filter
- **Functionality**: Search bar for campaign names and filter button for advanced criteria
- **Purpose**: Helps users find specific decisions quickly in large datasets
- **Trigger**: User types in search or clicks filter button
- **Progression**: User enters query → Table filters in real-time → Results update
- **Success criteria**: Search is responsive, filter button is accessible

#### Decision Type Tabs
- **Functionality**: Sub-tabs for Bid Decisions, Status Decisions, and Negating Decisions
- **Purpose**: Categorizes different types of AI actions for easier review
- **Trigger**: User clicks sub-tab
- **Progression**: User switches tab → Table content updates → Active indicator moves
- **Success criteria**: Smooth tab switching, active state visible

#### Bulk Actions
- **Functionality**: Checkbox selection and "Revert in Bulk" action
- **Purpose**: Allows users to undo multiple AI decisions at once
- **Trigger**: User checks rows and clicks Revert in Bulk
- **Progression**: User selects decisions → Clicks bulk action → Confirmation → Decisions revert
- **Success criteria**: Checkboxes functional, bulk button becomes enabled when selections exist

#### Row Details and Revert
- **Functionality**: Expandable row details and individual revert buttons
- **Purpose**: Lets users drill into decision context and undo individual actions
- **Trigger**: User clicks expand icon or revert button
- **Progression**: Expand: Row expands to show details; Revert: Decision undone with confirmation
- **Success criteria**: Expand icon toggles row detail, revert provides feedback

### Clear and Save Actions
- **Functionality**: Buttons to reset all inputs or persist current configuration
- **Purpose**: Allows users to start over or commit their changes
- **Trigger**: User clicks Clear Inputs or Save Goals button
- **Progression**: Clear: Click → All fields reset to defaults → Toast confirmation; Save: Click → Settings persist → Toast success
- **Success criteria**: Clear resets form, Save shows visual feedback and persists data

## Edge Case Handling
- **Incomplete Onboarding**: Prevent app access until both onboarding steps complete
- **No Scopes Selected**: Disable continue button on Step 2 until at least one scope is chosen
- **Eva AI with Custom Rules**: Allow custom rules to override AI decisions, show clear indicators
- **Empty Input Fields**: Validate numeric inputs and show error states for invalid bid ranges
- **Out of Range Bids**: Warn when min bid exceeds max bid or values are unreasonably high/low
- **No Selection Made**: Disable save until required fields (focus strategy, target type) are selected
- **Recommendation Click**: Clicking recommended values should populate the corresponding input field
- **Tab Switching with Unsaved Changes**: Settings auto-save or maintain state when switching tabs
- **Empty Optimization Tables**: Show helpful empty states with call-to-action to add first rule
- **Large Data Tables**: Implement pagination and horizontal scroll for many decision records
- **Heatmap Interaction**: Hover states show detailed metrics for specific time slots
- **Dialog State**: Preserve partially completed custom optimization when dialog is cancelled (or clear on cancel with warning)
- **Reconfiguration**: Reopening onboarding maintains current selections as defaults for editing
- **Theme Preference Persistence**: Save user's theme choice to localStorage and respect system preference on first visit
- **Theme Consistency**: Ensure all components render correctly in both light and dark modes with proper contrast
- **Initial Theme Load**: Apply saved or system-preferred theme before first render to prevent flash

## Design Direction
The design should evoke confidence, control, and clarity - feelings essential for users making business-critical advertising decisions. The interface must work seamlessly in both light and dark modes, maintaining visual hierarchy and readability in each context. The onboarding journey should feel guided yet empowering with clear choices. The step-by-step guidance in Store Settings should feel approachable yet professional. The heatmap visualization should be immediately intuitive with color intensity conveying performance. Clean card-based layouts with consistent spacing create visual breathing room while grid structures maintain organization.

## Color Selection
A dual-theme system supporting both light and dark modes with violet-anchored primary color.

**Light Mode:**
- **Primary Color**: Medium Violet `oklch(0.55 0.22 280)` - Commands attention for interactive elements and active states
- **Background**: Near White `oklch(0.98 0 0)` - Clean, bright base surface
- **Card**: Pure White `oklch(1 0 0)` - Elevated surfaces for content cards
- **Secondary**: Light Gray `oklch(0.93 0.01 265)` - Supporting UI elements
- **Muted**: Very Light Gray `oklch(0.96 0.005 265)` - Backgrounds for subtle emphasis
- **Border**: Light Gray `oklch(0.90 0.005 265)` - Dividers and borders

**Dark Mode:**
- **Primary Color**: Vibrant Violet `oklch(0.62 0.24 293)` - Commands attention for interactive elements and active states
- **Background**: Deep Space `oklch(0.12 0.01 265)` - Creates immersive dark environment
- **Card**: Slate Panel `oklch(0.18 0.02 255)` - Elevated surfaces for content cards
- **Secondary**: Dark Slate `oklch(0.25 0.02 255)` - Supporting UI elements
- **Muted**: Darker Gray `oklch(0.15 0.02 260)` - Backgrounds for subtle emphasis
- **Border**: Medium Gray `oklch(0.28 0.02 255)` - Dividers and borders

**Common:**
- **Accent Color**: Bright Violet (lighter in light mode, brighter in dark mode) - Hover states and emphasis
- **Destructive**: Red `oklch(0.577 0.245 27.325)` - Warning color for dangerous actions

**Foreground/Background Pairings**: 
  - Light Mode Background: Dark Text (oklch(0.13 0.01 265)) - Ratio 14.2:1 ✓
  - Light Mode Card: Dark Text (oklch(0.13 0.01 265)) - Ratio 15.1:1 ✓
  - Dark Mode Background: Light Gray text (oklch(0.88 0.01 265)) - Ratio 12.5:1 ✓
  - Dark Mode Card: White text (oklch(0.98 0 0)) - Ratio 14.8:1 ✓
  - Primary on White (Light): White text (oklch(0.98 0 0)) - Ratio 4.9:1 ✓
  - Primary on Dark (Dark): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓

## Font Selection
Poppins provides a modern geometric style with excellent readability and a friendly yet professional character suitable for data-dense configuration interfaces.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Poppins Semibold/24px/normal letter spacing
  - H2 (Section Headers): Poppins Bold/11px/wide letter spacing/uppercase
  - H3 (Field Labels): Poppins Medium/14px/normal letter spacing
  - Input Labels: Poppins Medium/12px/wide letter spacing/uppercase
  - Body (Input Values): Poppins Medium/14px
  - Helper Text: Poppins Regular/12px
  - Button Text: Poppins Semibold/14px

## Animations
Animations should be subtle and purposeful, reinforcing actions without creating delays. Use micro-interactions for state changes (100-150ms), smooth transitions for color shifts on hover (200ms), and gentle scaling feedback on button press. The violet focus ring should fade in smoothly when inputs receive focus. Theme transitions between light and dark mode should be instant to avoid jarring visual shifts.

## Component Selection
- **Components**: 
  - Dialog for onboarding modal (two-step process with progress indicator)
  - Tabs for main navigation (Store Settings, Dayparting, Campaign Creation, AI Decisions) with custom styling
  - Badge for management type indicator, scope count, optimization status, and campaign tags
  - RadioGroup for focus strategy, target type, and onboarding management selection
  - Input for bid amounts and target percentage
  - Select for optimization dropdowns and condition builders
  - Collapsible/Accordion for optimization sections to reduce visual complexity
  - Table for displaying AI decision data and optimization rules with priority controls
  - Button for navigation, actions (Clear, Save, Add Optimization, Create Rule, Revert), theme toggle, and onboarding flow
  - Card for onboarding options, left sidebar, main content panel, and dayparting legend
  - Separator for dividing sections
  - Checkbox for scope selection in onboarding
  - Popover for "Add Optimization" dropdown menu with three options
- **Customizations**: 
  - Dialog requires hide-close button styling for onboarding (prevent dismissal)
  - Onboarding cards need larger size with hover states and selected emphasis
  - Scope selection cards with custom checkbox styling integrated into card
  - Tabs require custom borderless styling with bottom border active indicator
  - Radio buttons need custom violet selection state with highlighted container for active option
  - Inputs require theme-aware styling (light/dark) with violet focus rings
  - Heatmap grid requires custom color gradient based on performance intensity
  - Badge needs multiple variants (Eva AI indicator, scope counter, optimization status)
  - Collapsible headers need hover states and rotating caret icons
  - Table rows need priority control arrows inline with row numbers
  - Dialog needs max-width increase for complex condition builder
  - Theme toggle button in header with Sun/Moon icons
- **States**: 
  - Onboarding cards: default/hover/selected (with border and background emphasis)
  - Scope checkboxes: unchecked/checked (integrated into card visual state)
  - Buttons: default/hover (darker violet)/active (scale down)/disabled (low opacity)
  - Inputs: default/hover (brighter border)/focus (violet ring)/filled
  - Radio: unchecked/checked (violet)/hover (border highlight)
  - Heatmap cells: default/hover (overlay with metric detail)/selected
  - Collapsible: collapsed/expanded (with rotating caret)
  - Table rows: default/hover (light muted background)
  - Tabs: inactive (muted text)/active (primary color + border)
  - Priority arrows: default/hover/disabled (when at list boundary)
  - Theme toggle: light mode (shows moon icon)/dark mode (shows sun icon)
- **Icon Selection**: Phosphor Icons for:
  - Sparkle (Eva AI indicator)
  - Home (navigation)
  - Info (tooltips)
  - Caret Down/Up (collapsibles and priority controls)
  - Plus (add actions)
  - Trash (delete actions)
  - Cursor Click (recommendation indicators)
  - Check (onboarding progress and scope selection)
  - X (dialog close)
  - Sun/Moon (theme toggle)
- **Spacing**: 
  - Section gaps: 24px (gap-6)
  - Form field spacing: 20px (gap-5)
  - Input internal padding: 8px 12px (px-3 py-2)
  - Card padding: 24px (p-6)
  - Grid column gap: 24px (gap-6)
  - Step sections: 12px gap between title and description
- **Mobile**: 
  - Two-column layout stacks to single column below 1024px
  - Navigation tabs remain horizontal with smaller text
  - Sub-tabs (Bid/Status/Negating Decisions) may stack or scroll horizontally
  - Table becomes horizontally scrollable with sticky first column
  - Dropdowns become full-width
  - Buttons stack vertically in footer
  - Maintain padding but reduce outer margins
  - Collapsible sections remain full-width
