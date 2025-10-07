import multiavatar from '@multiavatar/multiavatar/esm'
import { createImagePaint } from '@create-figma-plugin/utilities'

type FillableNode = SceneNode & GeometryMixin

function isFillableNode(node: SceneNode): node is FillableNode {
  return 'fills' in node
}

async function createAvatarPaint(
  seed: string,
  targetWidth: number,
  targetHeight: number
): Promise<ImagePaint> {
  const svgMarkup = replaceCircleBackgroundWithSquare(multiavatar(seed))
  const svgNode = figma.createNodeFromSvg(svgMarkup) as FrameNode

  // Park the temporary node outside the viewport so it does not flash on screen.
  svgNode.x = figma.viewport.bounds.x + figma.viewport.bounds.width + 1000
  svgNode.y = figma.viewport.bounds.y + figma.viewport.bounds.height + 1000

  try {
    const maxDimension = Math.max(Math.max(targetWidth, targetHeight), 1)
    const scale = (maxDimension * 2) / svgNode.width

    const pngBytes = await svgNode.exportAsync({
      format: 'PNG',
      constraint: { type: 'SCALE', value: Math.max(scale, 0.01) }
    })
    return createImagePaint(pngBytes)
  } finally {
    svgNode.remove()
  }
}

const circleBackgroundRegex =
  /<path[^>]*d="M33\.83,33\.83a115\.5,115\.5,0,1,1,0,163\.34,115\.49,115\.49,0,0,1,0-163\.34Z"[^>]*>/

function replaceCircleBackgroundWithSquare(svgMarkup: string): string {
  const match = svgMarkup.match(circleBackgroundRegex)

  if (match === null) {
    return svgMarkup
  }

  const styleMatch = match[0].match(/style="([^"]*)"/)

  const style = styleMatch === null ? '' : styleMatch[1]

  const rectMarkup = `<rect x="0" y="0" width="231" height="231"${style === '' ? '' : ` style="${style}"`} />`

  return svgMarkup.replace(circleBackgroundRegex, rectMarkup)
}

export default async function () {
  const fillableNodes = figma.currentPage.selection.filter(isFillableNode)

  if (fillableNodes.length === 0) {
    figma.notify('Please select at least one fillable layer')
    figma.closePlugin()
    return
  }

  const timestampSeed = Date.now().toString()

  for (let index = 0; index < fillableNodes.length; index += 1) {
    const node = fillableNodes[index]
    const seed =
      fillableNodes.length === 1
        ? timestampSeed
        : `${timestampSeed}-${index + 1}`

    const avatarPaint = await createAvatarPaint(seed, node.width, node.height)

    const fills = node.fills

    if (fills === figma.mixed || fills.length === 0) {
      node.fills = [avatarPaint]
      continue
    }

    const paints = [...fills]
    paints[0] = avatarPaint
    node.fills = paints
  }

  const layerCount = fillableNodes.length
  const layerSuffix = layerCount === 1 ? '' : 's'
  const avatarSuffix = layerCount === 1 ? '' : 's'

  figma.closePlugin(
    `Filled ${layerCount} layer${layerSuffix} with Multiavatar avatar${avatarSuffix}`
  )
}
