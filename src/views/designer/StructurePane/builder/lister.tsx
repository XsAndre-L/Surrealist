import { Accordion, Group, Stack, Button, Text, Space, ActionIcon, Box, Paper, Modal, Title } from "@mantine/core";
import { mdiCircle, mdiClose, mdiDelete, mdiPlus } from "@mdi/js";
import { ReactNode, useState } from "react";
import { Icon } from "~/components/Icon";
import { Spacer } from "~/components/Spacer";
import { useStable } from "~/hooks/stable";
import { useIsLight } from "~/hooks/theme";

export interface ListerProps<T> {
	name: string;
	missing: string;
	value: T[];
	children: (item: T, index: number) => ReactNode;
	onCreate: () => void;
	onRemove: (index: number) => void;
}

export function Lister<T extends { name: string }>(props: ListerProps<T>) {
	const isLight = useIsLight();
	const [isEditing, setIsEditing] = useState(false);
	const [editingIndex, setEditingIndex] = useState(-1);

	const openEditor = useStable((index: number) => {
		setEditingIndex(index);
		setIsEditing(true);
	});

	const closeEditor = useStable(() => {
		setIsEditing(false);
	});

	const handleRemove = useStable((e: React.MouseEvent, index: number) => {
		e.stopPropagation();
		props.onRemove(index);
		setEditingIndex(-1);
		setIsEditing(false);
	});

	return (
		<>
			{props.value.length > 0 ? (
				<Stack spacing={6}>
					{props.value.map((item, i) => (
						<Paper
							key={i}
							py="xs"
							pr="xs"
							pl="md"
							bg="dark.9"
							pos="relative"
							radius="md"
							style={{ border: 0, cursor: 'pointer' }}
							onClick={() => openEditor(i)}
						>
							<Group spacing="sm">
								<Icon
									path={mdiCircle}
									color="surreal"
									size={0.45}
								/>
								{item.name
									? <Text color="white">{item.name}</Text>
									: <Text color="dark.3" italic>Unnamed {props.name}</Text>
								}
								<Spacer />
								<ActionIcon
									role="button"
									component="div"
									onClick={e => handleRemove(e, i)}
									color="red"
								>
									<Icon path={mdiClose} color="red" />
								</ActionIcon>
							</Group>
						</Paper>
					))}
				</Stack>
			) : (
				<Text align="center">
					{props.missing}
				</Text>
			)}

			<Button
				mt="md"
				size="xs"
				fullWidth
				variant="outline"
				rightIcon={<Icon path={mdiPlus} />}
				onClick={props.onCreate}
			>
				Add {props.name}
			</Button>

			<Modal
				opened={isEditing}
				onClose={closeEditor}
				trapFocus={false}
				title={
					<Title size={16} color={isLight ? 'light.6' : 'white'}>
						Editing {props.name}
					</Title>
				}
			>
				<Stack>
					{editingIndex >= 0 && props.children(props.value[editingIndex], editingIndex)}
				</Stack>
				<Group mt="xl">
					<Button
						onClick={closeEditor}
					>
						Close
					</Button>
				</Group>
			</Modal>
		</>
	)
}