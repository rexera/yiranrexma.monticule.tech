declare module "plotly.js-dist-min" {
  export interface PlotlyStatic {
    newPlot(
      el: HTMLElement,
      data: unknown,
      layout?: unknown,
      config?: unknown
    ): Promise<unknown>;
    react(
      el: HTMLElement,
      data: unknown,
      layout?: unknown,
      config?: unknown
    ): Promise<unknown>;
    purge(el: HTMLElement): void;
    Plots: { resize(el: HTMLElement): void };
  }
  const Plotly: PlotlyStatic;
  export default Plotly;
}
