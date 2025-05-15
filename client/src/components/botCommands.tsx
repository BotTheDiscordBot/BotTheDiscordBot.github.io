import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface BotCommand {
  id: number;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

interface BotCommandsProps {
  commands: BotCommand[];
  onEdit: (command: BotCommand) => void;
  onToggle: (command: BotCommand) => void;
}

const BotCommands: React.FC<BotCommandsProps> = ({ commands, onEdit, onToggle }) => {
  // Function to get the category badge color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'General':
        return 'bg-blue-900 text-blue-300';
      case 'Economy':
        return 'bg-yellow-900 text-yellow-300';
      case 'Levels':
        return 'bg-purple-900 text-purple-300';
      case 'Music':
        return 'bg-indigo-900 text-indigo-300';
      case 'Games':
        return 'bg-red-900 text-red-300';
      case 'Moderation':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-900">
          <TableRow>
            <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Command</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-700 bg-gray-800">
          {commands.length > 0 ? (
            commands.map((command) => (
              <TableRow key={command.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">!{command.name}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">{command.description}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(command.category)}`}>
                    {command.category}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">
                  <button
                    onClick={() => onToggle(command)}
                    className="relative inline-flex rounded-full h-3 w-3 cursor-pointer"
                  >
                    <span className={`inline-flex rounded-full h-3 w-3 ${command.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </button>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(command)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                No commands found. Add some commands to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BotCommands;
